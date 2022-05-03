import { spawnSync } from "child_process";
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

export interface Builder {
  addFile(path: string): Builder;
  define(name: string): Builder;
  include(path: string): Builder;
  link(library: string): Builder;
  build(): void;
}

class DefaultBuilder implements Builder {
  private compileDefinitions: string[] = [];
  private includes: string[] = [];
  private linkedLibs: string[] = [];
  private sources: string[] = [];

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

  public build(): void {
    let cmd = [this.sources.join(" ")];

    if (this.compileDefinitions.length > 0)
      cmd.push(this.compileDefinitions.map((d) => `-D${d}`).join(" "));

    if (this.includes.length > 0)
      cmd.push(this.includes.map((i) => `-I${i}`).join(" "));

    if (this.linkedLibs.length > 0)
      cmd.push(this.linkedLibs.map((l) => `-l${l}`).join(" "));

    let command = cmd.join(" ").split(" ");

    console.log("g++", command.join(" "), "\n");

    spawnSync("g++", command, {
      env: process.env,
      stdio: [null, process.stdout, process.stderr],
      encoding: "utf-8",
    });
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
