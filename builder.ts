import { cwd } from "process";
import { Builder, Project } from "./common";
import { Executable } from "./executable";
import { Library } from "./library";
import { CMakeEmitter } from "./cmake_emitter";
import { log } from "./log";

export class DefaultBuilder implements Builder {
  public compileDefinitions: string[] = [];
  public projects: Project[] = [];
  public output: CMakeEmitter;

  constructor(public baseDir: string = cwd()) {
    this.output = new CMakeEmitter(this);
    this.output.addLine(`cmake_minimum_required(VERSION 3.15.0)`);
    this.output.addLine(`cmake_policy(SET CMP0091 NEW)`);
    this.output.addLine(`project(mei_project)`);
    this.output.newLine();
    this.output.emitXMakeDownloadScript();
  }

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

  public async build() {
    log.error("not implemented");
  }
}
