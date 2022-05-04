#!/usr/bin/env ts-node

import { spawnSync, spawn } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import FileHound from "filehound";

const cd = cwd();
const configPath = join(cd, "build.ts");
const defaultConfig = `
import { Builder } from "@sweetacid/mei";

export default function (builder: Builder) {
  //    config operations here
  console.log("Build successful.");
}
`;

export interface Project {
  addFile(path: string): Project;
  define(name: string): Project;
  include(path: string): Project;
  link(library: string): Project;
  build(): Promise<Builder>;
}

export interface Builder {
  compileDefinitions: string[];

  addExecutable(name: string): Executable;
  addLibrary(name: string): Library;
  define(name: string): Builder;
  build(): void;
}

abstract class BaseProject implements Project {
  protected compileDefinitions: string[] = [];
  protected includes: string[] = [];
  protected linkedLibs: string[] = [];
  protected sources: string[] = [];

  constructor(protected builder: Builder, public name: string) {
    this.compileDefinitions.push(...this.builder.compileDefinitions);
  }

  public addFile(path: string) {
    const files = FileHound.create().paths(cd).match(path).findSync();
    this.sources.push(...files);
    return this;
  }

  public define(name: string) {
    this.compileDefinitions.push(name);
    return this;
  }

  public include(path: string) {
    this.includes.push(path);
    return this;
  }

  public link(library: string) {
    this.linkedLibs.push(library);
    return this;
  }

  public abstract build(): Promise<Builder>;
}

class Executable extends BaseProject {
  public override async build() {
    let cmd = [this.sources.join(" ")];

    if (this.compileDefinitions.length > 0)
      cmd.push(this.compileDefinitions.map((d) => `-D${d}`).join(" "));

    if (this.includes.length > 0)
      cmd.push(this.includes.map((i) => `-I${i}`).join(" "));

    if (this.linkedLibs.length > 0)
      cmd.push(this.linkedLibs.map((l) => `-l${l}`).join(" "));

    cmd.push("-o", `${this.name}`);

    let command = cmd.join(" ").split(" ");

    console.log("[EXECUTE]", "g++", command.join(" "));

    spawnSync("g++", command, {
      env: process.env,
      stdio: [null, process.stdout, process.stderr],
      encoding: "utf-8",
    });

    console.log("[CREATE]", this.name);

    return this.builder;
  }
}

class Library extends BaseProject {
  public override async build() {
    const cxxArgs = ["-o", `${this.name}.o`, "-x", "c++", "-"];
    const printfArgs = [`#include "%s"\n`, ...this.sources];

    console.log(
      "[EXECUTE]",
      "printf",
      [`'#include "%s"\\n'`, ...this.sources].join(" "),
      "|",
      "g++",
      cxxArgs.join(" ")
    );

    const printf = spawn("printf", printfArgs, {
      env: process.env,
    });

    const child = spawn("g++", cxxArgs, {
      env: process.env,
      stdio: [printf.stdout, process.stdout, process.stderr],
    });

    await new Promise((resolve) => {
      child.on("exit", (code) => {
        if (code === 0) {
          console.log("[CREATE]", `${this.name}.o`);
          resolve(code);
        } else {
          throw new Error(`[FAILED] building ${this.name}.o, code ${code}`);
        }
      });
    });

    return this.builder;
  }
}

class DefaultBuilder implements Builder {
  public compileDefinitions: string[] = [];

  private projects: Project[] = [];

  public addExecutable(name: string): Executable {
    let exe = new Executable(this, name);
    this.projects.push(exe);
    return exe;
  }

  public addLibrary(name: string): Library {
    let lib = new Library(this, name);
    this.projects.push(lib);
    return lib;
  }

  public define(name: string) {
    this.compileDefinitions.push(name);
    return this;
  }

  public build(): void {
    for (let i = 0; i < this.projects.length; i++) this.projects[i].build();
  }
}

const runningAsScript = require.main === module;
if (runningAsScript) {
  if (!existsSync(configPath)) {
    writeFileSync(configPath, defaultConfig);
    console.log("[ CREATED ]", configPath);
  }

  const config = require(configPath);
  if (typeof config.default !== "function") process.exit(1);

  config.default(new DefaultBuilder());
}
