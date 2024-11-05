import { cwd } from "process";
import { Builder, Project } from "./common";
import { Executable } from "./executable";
import { Library } from "./library";
import { CMakeEmitter } from "./cmake_emitter";

export class DefaultBuilder implements Builder {
  public compileDefinitions: string[] = [];
  public projects: Project[] = [];
  public output: CMakeEmitter;

  constructor(public baseDir: string = cwd()) {
    this.output = new CMakeEmitter(this);
    this.output.addLine(`cmake_minimum_required(VERSION 3.15.0)`);
    this.output.addLine(`cmake_policy(SET CMP0091 NEW)`);
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

  public build(): void {
    for (let i = 0; i < this.projects.length; i++) this.projects[i].build();
  }
}
