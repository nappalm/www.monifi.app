#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const readline = require("readline");

function promptForProjectName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Please provide a project name: ", (name) => {
      rl.close();
      if (!name || !name.trim()) {
        console.error("Project name cannot be empty.");
        process.exit(1);
      }
      resolve(name.trim());
    });
  });
}

async function main() {
  let projectName = process.argv[2];
  if (!projectName) {
    projectName = await promptForProjectName();
  }

  const currentPath = process.cwd();
  const projectPath = path.join(currentPath, projectName);
  const gitRepo = "https://github.com/nappalm/builfast.git";

  try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    if (err.code === "EEXIST") {
      console.error(`The directory ${projectName} already exists.`);
    } else {
      console.error(err);
    }
    process.exit(1);
  }

  try {
    console.log(`Cloning the repository into ${projectPath}...`);
    execSync(`git clone ${gitRepo} ${projectPath}`);

    process.chdir(projectPath);

    execSync("rm -rf bin");

    console.log("Updating package.json...");
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.name = projectName;
    delete packageJson.bin; // The new project doesn't need the bin entry
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log("Installing dependencies...");
    execSync("npm install");

    console.log("Cleaning up git history...");
    execSync("rm -rf .git");
    execSync("git init -b main");
    execSync("git add .");
    execSync('git commit -m "feat: initial commit"');

    console.log("\nDone! Your project is ready.\n");
    console.log(`To get started, run:\n`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm run dev`);
  } catch (error) {
    console.error("An error occurred:", error);
    // Clean up the created directory if an error occurs
    console.log("Cleaning up failed installation...");
    fs.rmSync(projectPath, { recursive: true, force: true });
  }
}

main();
