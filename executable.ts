import { spawnSync } from "child_process";
import { BaseProject } from "./base";

export class Executable extends BaseProject {
  public override async build() {
    const isLocalLib = (lib: string) => lib.endsWith(".a");
    const isSystemLib = (lib: string) => !lib.endsWith(".a");
    const systemLibs = this.linkedLibs.filter(isSystemLib);
    const localLibs = this.linkedLibs.filter(isLocalLib).map((l) => `lib${l}`);

    let cmd = [this.sources.join(" ")];

    if (localLibs.length > 0) cmd.push(localLibs.join(" "));

    if (this.compileDefinitions.length > 0)
      cmd.push(this.compileDefinitions.map((d) => `-D${d}`).join(" "));

    if (this.includes.length > 0)
      cmd.push(this.includes.map((i) => `-I${i}`).join(" "));

    if (systemLibs.length > 0)
      cmd.push(systemLibs.map((l) => `-l${l}`).join(" "));

    cmd.push("-o", `${this.name}`);

    let command = cmd.join(" ").split(" ");

    console.log("[EXECUTE]", "g++", command.join(" "));

    spawnSync("g++", command, {
      env: process.env,
      cwd: this.builder.baseDir,
      stdio: [null, process.stdout, process.stderr],
      encoding: "utf-8",
    });

    console.log("[CREATE]", this.name);

    return this.builder;
  }
}
