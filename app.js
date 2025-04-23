const cluster = require("cluster");
const os = require("os");
const express = require("express");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Number of CPUs: ${numCPUs}`);
  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
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

  const indexRouter = require("./routes/index");
  const usersRouter = require("./routes/userRoute")();
  const { connectdb } = require("./dbConnection");

  const app = express();
  const PORT = process.env.PORT || 4000;

  connectdb();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }));

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

  app.listen(PORT, () => {
    console.log(`✅ Worker ${process.pid} running on port ${PORT}`);
  });
}
