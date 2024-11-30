#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const templateDir = path.join(__dirname, '..'); // Root folder of your setup
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: mysql-code <project-name>');
    process.exit(1);
}

const projectName = args[0];
const targetDir = path.join(process.cwd(), projectName);

if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
}

try {
    // Copy files
    const copyRecursiveSync = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (let entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyRecursiveSync(srcPath, destPath);
            } else if (!entry.name.endsWith('.npmignore')) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    };

    fs.mkdirSync(targetDir, { recursive: true });
    copyRecursiveSync(templateDir, targetDir);

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
