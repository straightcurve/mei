#!/usr/bin/env ts-node

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { Command } from "commander";

import { DefaultBuilder } from "./builder";
import { spawnSync } from "child_process";
import { cmd } from "./utils";
import { log } from "./log";
import path from "node:path";

export * from "./common";

const cd = cwd();
const getDefaultConfig = (name: string) => `
import { Builder } from "@sweetacid/mei";

export default async function (builder: Builder) {
  await builder
    .addExecutable("${name}")
    .addDirectory("src")
    .build();
}
`;

const getExampleMainCpp = () => `
#include <stdio.h>

int main() {
  printf("generated with mei :3");
}
`;

const runningAsScript = require.main === module;
if (runningAsScript) {
  bootstrap();
}

async function bootstrap() {
  const program = new Command();
  const options = program
    .option("-n, --new <path>", "create a new project at path")
    .option("-c, --config", "init config in current directory")
    .parse()
    .opts();

  let projectPath = cd;
  if (options.new) {
    projectPath = join(cd, options.new);

    const packageJsonPath = join(projectPath, "package.json");
    if (existsSync(packageJsonPath))
      throw new Error(`[FAILED] project folder not empty, stat ${projectPath}`);

    if (!existsSync(projectPath)) mkdirSync(projectPath);

    const srcPath = join(projectPath, "src");
    if (!existsSync(srcPath)) mkdirSync(srcPath);

    const mainCppPath = join(srcPath, "main.cpp");
    if (!existsSync(mainCppPath)) {
      writeFileSync(mainCppPath, getExampleMainCpp());
      log.info("[CREATE]", path.relative(cd, mainCppPath));
    }

    spawnSync("npm", ["init", "-y"], {
      cwd: projectPath,
      stdio: [null, null, process.stderr],
    });

    spawnSync("npm", ["i", "@sweetacid/mei"], {
      cwd: projectPath,
      stdio: [null, null, process.stderr],
    });
  } else if (options.config) {
    const packageJsonPath = join(cd, "package.json");
    if (!existsSync(packageJsonPath)) {
      cmd("npm", ["init", "-y"], {
        cwd: cd,
        stdio: [null, null, process.stderr],
      });

      cmd("npm", ["install", "@sweetacid/mei"], {
        cwd: cd,
        stdio: [null, process.stdout, process.stderr],
      });
    }
  }

  const projectName = projectPath.slice(projectPath.lastIndexOf("/") + 1);
  const configPath = join(projectPath, "build.ts");
  if (!existsSync(configPath)) {
    writeFileSync(configPath, getDefaultConfig(projectName));
    log.info("[CREATE]", path.relative(cd, configPath));
  }

  const config = require(configPath);
  if (typeof config.default !== "function") {
    log.error(
      "make sure you export a default function from the build.ts file!"
    );

    process.exit(1);
  }

  await config.default(new DefaultBuilder(projectPath));
}
