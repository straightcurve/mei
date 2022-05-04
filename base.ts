import { join } from "path";
import { cwd } from "process";
import FileHound from "filehound";
import { Builder, Project } from "./common";

export abstract class BaseProject implements Project {
  protected compileDefinitions: string[] = [];
  protected includes: string[] = [];
  protected linkedLibs: string[] = [];
  protected sources: string[] = [];

  constructor(protected builder: Builder, public name: string) {
    this.compileDefinitions.push(...this.builder.compileDefinitions);
  }

  public addDirectory(path: string) {
    const files = FileHound.create()
      .paths(join(this.builder.baseDir, path))
      //@ts-ignore
      .match(["*.h", "*.cpp", "**/*.h", "**/*.cpp"])
      .findSync();
    this.sources.push(...files);
    return this;
  }

  public addFile(path: string) {
    const files = FileHound.create()
      .paths(this.builder.baseDir)
      .match(path)
      .findSync();
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
    const lib = this.builder.projects.find((p) => p.name === library);
    if (lib === undefined) this.linkedLibs.push(library);
    else this.linkedLibs.push(`${lib.name}.a`);
    return this;
  }

  public abstract build(): Promise<Builder>;
}
