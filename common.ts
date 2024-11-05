import { CMakeEmitter } from "./cmake_emitter";

export interface Project {
  name: string;

  kind: "lib" | "exe";
  cxxStandard: string;
  cxxFlags: string[];
  pCXXHeader: string;

  setCXXFlags(...flags: string[]): Project;

  setCXXStandard(value: string): Project;

  setLinkOptions(...options: string[]): Project;

  setPCXXHeader(value: string): Project;

  addDirectory(path: string): Project;

  addFile(path: string): Project;

  addPackages(...names: string[]): Project;

  define(...defines: string[]): Project;

  dependOn(project: Project): Project;

  include(...paths: string[]): Project;

  link(...libraries: string[]): Project;

  build(): Promise<Builder>;
}

export interface Builder {
  baseDir: string;
  compileDefinitions: string[];
  projects: Project[];
  output: CMakeEmitter;

  addExecutable(name: string): Project;

  addLibrary(name: string): Project;

  define(name: string): Builder;

  build(): void;
}

export type XRepoPackage = {
  version: string;
  includedirs: string[];
  static: boolean;
  linkdirs: string[];
  links: string[];
  libfiles: string[];
  name: string;
};
