import { spawn } from "child_process";
import { BaseProject } from "./base";

export class Library extends BaseProject {
  public override async build() {
    const cxxArgs = ["-c", "-o", `lib${this.name}.o`, "-x", "c++", "-"];
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
      cwd: this.builder.baseDir,
    });

    const cxx = spawn("g++", cxxArgs, {
      env: process.env,
      cwd: this.builder.baseDir,
      stdio: [printf.stdout, process.stdout, process.stderr],
    });

    await new Promise((resolve) => {
      cxx.on("exit", (code) => {
        if (code === 0) {
          console.log("[CREATE]", `lib${this.name}.o`);
          resolve(code);
        } else {
          throw new Error(`[FAILED] compiling ${this.name}.o, code ${code}`);
        }
      });
    });

    const arArgs = ["rusU", `lib${this.name}.a`, `lib${this.name}.o`];
    const ar = spawn("ar", arArgs, {
      env: process.env,
      cwd: this.builder.baseDir,
      stdio: [null, process.stdout, process.stderr],
    });

    await new Promise((resolve) => {
      ar.on("exit", (code) => {
        if (code === 0) {
          console.log("[CREATE]", `lib${this.name}.a`);
          resolve(code);
        } else {
          throw new Error(
            `[FAILED] creating archive ${this.name}.a, code ${code}`
          );
        }
      });
    });

    return this.builder;
  }
}
