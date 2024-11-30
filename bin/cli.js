#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const templateDir = path.join(__dirname, '..'); // Root folder of your setup
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: mysql-code-generator <project-name>');
    process.exit(1);
}

const projectName = args[0];
const targetDir = path.join(process.cwd(), projectName);

if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
}

try {
    // Function to recursively copy files and exclude certain files
    const copyRecursiveSync = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (let entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            // Exclude bin/cli.js and any other files you don't want to copy
            if (entry.name === 'cli.js') continue;

            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyRecursiveSync(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    };

    // Create the project directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy all necessary files, excluding bin/cli.js
    copyRecursiveSync(templateDir, targetDir);

    // Create the desired package.json file for the generated project
    const packageJson = {
        name: projectName,
        version: "1.0.0",
        description: "A Node.js project setup with MySQL, Sequelize, and authentication features.",
        main: "bin/cli.js",
        scripts: {
            start: "nodemon ./bin/www"
        },
        dependencies: {
            bcrypt: "^5.1.1",
            "cookie-parser": "^1.4.7",
            crypto: "^1.0.1",
            debug: "^4.3.7",
            dotenv: "^16.4.5",
            ejs: "^3.1.10",
            express: "^4.21.1",
            "express-fileupload": "^1.5.1",
            "http-errors": "^2.0.0",
            joi: "^17.13.3",
            jsonwebtoken: "^9.0.2",
            morgan: "^1.10.0",
            mysql2: "^3.11.4",
            "node-twillo-otp-manager": "^1.0.0",
            nodemailer: "^6.9.16",
            nodemon: "^3.1.7",
            sequelize: "^6.37.5",
            "swagger-ui-express": "^5.0.1"
        }
    };

    // Write the new package.json to the target project folder
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    console.log(`Project setup created at "${targetDir}"`);

    // Install dependencies
    console.log('Installing dependencies...');
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });

    console.log('Setup complete! Start your project with:');
    console.log(`cd ${projectName}`);
    console.log('npm start');
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
