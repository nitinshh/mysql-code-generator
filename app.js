const cluster = require("cluster");
const os = require("os");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Number of CPUs: ${numCPUs}`);
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  // Setup for socket.io cluster adapter
  setupPrimary(); // <--- THIS IS REQUIRED

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
  // Worker process
  require("dotenv").config();
  const createError = require("http-errors");
  const path = require("path");
  const cookieParser = require("cookie-parser");
  const logger = require("morgan");
  const fileUpload = require("express-fileupload");
  const swaggerUi = require("swagger-ui-express");
  const rateLimit = require("express-rate-limit");
  const helmet = require("helmet");

  const indexRouter = require("./routes/index");
  const usersRouter = require("./routes/userRoute")();
  const { connectdb } = require("./dbConnection");

  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    transports: ["websocket"], // recommended for better performance
  });

  io.adapter(createAdapter()); // <--- CLUSTER ADAPTER

  require("./socket")(io); // Custom socket handler

  // Standard Express setup
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(helmet());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later.",
  });

  app.use(limiter);

  app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: "/user", name: "User API" },
        { url: "/business", name: "Business API" },
      ],
    },
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));
  app.use("/", indexRouter);
  app.use("/users", usersRouter);

  app.use((req, res, next) => next(createError(404)));

  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
  });

  // Start the server
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`✅ Worker ${process.pid} running on port ${PORT}`);
  });
}
