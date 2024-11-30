# Basic Node.js Project Setup with MySQL and Sequelize
This package provides a complete Node.js project template with pre-configured MySQL, Sequelize, JWT authentication, email integration via Nodemailer, and Twilio OTP support. It simplifies project setup, allowing developers to focus on writing application logic.

# Features
Express.js for routing and middleware.
Sequelize ORM pre-configured for MySQL database integration.
JWT for secure authentication.
Nodemailer for email services (e.g., SMTP, Gmail, OAuth2).
Twilio for OTP and SMS services.
A well-structured and scalable directory layout.
Example .env file for easy environment configuration.

# Installation
1. Install the Package
Run the following command to install the setup directly into your project:

```bash
 npx mysql-code-generator <project-name>
 cd <project-name>
```

2. Install Dependencies
Ensure all dependencies are installed by navigating to the project directory and running:

```bash
 npm install
```

3. Start the Server

```bash
 npm start
```

4. Configure the .env File
After installation, a .env file will be included in the root directory. Update the file with your specific environment variables.

Example .env file:

```bash
# Database Configuration
DATABASE_NAME = YOUR_DATABASE_NAME
DATABASE_USER = YOUR_DATABASE_USER
DATABASE_PASSWORD = YOUR_DATABASE_PASSWORD
DATABASE_HOST = YOUR_DATABASE_HOST
DIALECT = mysql  # Example: mysql

# Security
SECRET_KEY = your_random_secret_key_here  # Replace with a secure, random string
SALT = 10  # Salt rounds for bcrypt

# Nodemailer Configuration
SERVICE = YOUR_MAIL_SERVICE  # Example: gmail
MAIL_TYPE = YOUR_MAIL_TYPE  # Example: OAuth2
MAIL_USERNAME = YOUR_MAIL_USERNAME
MAIL_PASSWORD = YOUR_MAIL_PASSWORD
OAUTH_CLIENTID = YOUR_NODEMAILER_CLIENT_ID
OAUTH_CLIENT_SECRET = YOUR_NODEMAILER_CLIENT_SECRET
OAUTH_REFRESH_TOKEN = YOUR_REFRESH_TOKEN_FOR_NODEMAILER

# Twilio Configuration
TWILIO_ACCOUNT_SID = YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN = YOUR_TWILIO_AUTH_TOKEN
TWILIO_SERVICE_SID = YOUR_TWILIO_SERVICE_SID
```


# Directory Structure

```bash
├── bin/                # Server startup scripts
├── config/             # Configuration files
├── controllers/        # Business logic for 
├── helpers/            # Utility functions
├── middlewares/        # Middleware functions (e.g., authentication)
├── models/             # Sequelize models
├── public/             # Static files (e.g., images, CSS)
├── routes/             # Route definitions
├── views/              # EJS templates
├── app.js              # Main entry point of the application
├── dbConnection.js     # Database connection logic
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Dependency lock file
└── .env                # Environment variables
```

The following npm packages are included in this setup:

```
bcrypt: For password hashing
cookie-parser: To parse cookies
crypto: Built-in Node.js cryptographic utilities
dotenv: For environment variable management
ejs: Embedded JavaScript templating
express: Fast, unopinionated web framework
express-fileupload: Middleware for file uploads
http-errors: For error handling
joi: Schema validation
jsonwebtoken: For JWT authentication
morgan: HTTP request logger
mysql2: MySQL database adapter
nodemailer: For sending emails
nodemon: Development server auto-reloader
node-twillo-otp-manager: Twilio for otp. https://npm.io/package/node-twillo-otp-manager
sequelize: ORM for MySQL
swagger-ui-express: For API documentation
```
# Install any missing dependencies with:
```bash
npm install
```
# Built With
```
Node.js
Express.js
Sequelize
MySQL
Nodemailer
Twilio
```

# License
This project is licensed under the MIT License.

