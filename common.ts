export interface Project {
  name: string;

  addDirectory(path: string): Project;
  addFile(path: string): Project;
  define(name: string): Project;
  include(path: string): Project;
  link(library: string): Project;
  build(): Promise<Builder>;
}

export interface Builder {
  baseDir: string;
  compileDefinitions: string[];
  projects: Project[];

  addExecutable(name: string): Project;
  addLibrary(name: string): Project;
  define(name: string): Builder;
  build(): void;
}
