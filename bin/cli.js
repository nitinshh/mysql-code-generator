#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
    // Function to recursively copy files and directories
    const copyRecursiveSync = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (let entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            // Exclude 'cli.js' and 'README.md' from being copied
            if (entry.isFile() && (entry.name === 'cli.js' || entry.name === 'README.md')) {
                continue;
            }

            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyRecursiveSync(srcPath, destPath);
            } else {
                // Copy all other files including 'bin/www'
                fs.copyFileSync(srcPath, destPath);
            }
        }
    };

    // Create the target directory for the new project
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy all necessary files from the template to the new project directory
    copyRecursiveSync(templateDir, targetDir);

    console.log(`Project setup created at "${targetDir}"`);

    // Custom package.json to be created in the new project folder
    const packageJson = {
        name: projectName,
        version: "1.0.0",
        description: "A CLI tool to generate a Node.js project setup with MySQL, Sequelize, and authentication features.",
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
            "express-rate-limit": "^7.5.0",
            "helmet": "^8.1.0",
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

    // Write the custom package.json to the new project folder
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    console.log('Project setup complete!');
    console.log('You can now navigate to the project folder and run "npm install" to install dependencies.');
    console.log(`cd ${projectName}`);
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
