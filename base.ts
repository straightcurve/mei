import { join } from "path";
import FileHound from "filehound";
import { Builder, Project, XRepoPackage } from "./common";
import { xrepo } from "./api";

export abstract class BaseProject implements Project {
  public abstract get kind(): Project["kind"];

  constructor(
    protected builder: Builder,
    public name: string
  ) {
    this._compileDefinitions.push(...this.builder.compileDefinitions);
  }

  public get compileDefinitions(): string[] {
    return this._compileDefinitions;
  }

  public get includes(): string[] {
    return this._includes;
  }

  public get linkedLibs(): string[] {
    return this._linkedLibs;
  }

  public get sources(): string[] {
    return this._sources;
  }

  public get xrepoPackages(): XRepoPackage[] {
    return this._xrepoPackages;
  }

  public get cxxFlags(): string[] {
    return this._cxxFlags;
  }

  public get linkOptions(): string[] {
    return this._linkOptions;
  }

  public get dependencies(): Project[] {
    return this._dependencies;
  }

  public get cxxStandard(): string {
    return this._cxxStandard;
  }

  public get pCXXHeader(): string {
    return this._pCXXHeader;
  }

  /**
   * @example "20"
   */
  public setCXXStandard(value: string): Project {
    this._cxxStandard = value;
    return this;
  }

  public setCXXFlags(...flags: string[]): Project {
    this._cxxFlags.push(...flags);
    return this;
  }

  public setLinkOptions(...options: string[]): Project {
    this._linkOptions.push(...options);
    return this;
  }

  public setPCXXHeader(value: string): Project {
    this._pCXXHeader = value;
    return this;
  }

  public abstract build(): Promise<Builder>;

  public addDirectory(path: string) {
    const files = FileHound.create()
      .paths(join(this.builder.baseDir, path))
      //@ts-ignore
      .match(["*.cpp", "**/*.cpp"])
      .findSync();
    this._sources.push(...files);
    return this;
  }

  public addFile(path: string) {
    const files = FileHound.create()
      .paths(this.builder.baseDir)
      .match(path)
      .findSync();
    this._sources.push(...files);
    return this;
  }

  public addPackages(...names: string[]) {
    for (const name of names) {
      const pkg = xrepo.fetch(name);
      pkg.name = name;

      this._xrepoPackages.push(pkg);
    }

    return this;
  }

  public define(...defines: string[]) {
    this._compileDefinitions.push(...defines);
    return this;
  }

  public dependOn(project: Project) {
    this._dependencies.push(project);
    return this;
  }

  public include(...paths: string[]) {
    this._includes.push(...paths);
    return this;
  }

  public link(...libraries: string[]) {
    this._linkedLibs.push(...libraries);

    // for (const library of libraries) {
    //   const lib = this.builder.projects.find((p) => p.name === library);
    //   if (lib === undefined) this._linkedLibs.push(library);
    //   else this._linkedLibs.push(`${lib.name}.a`);
    // }

    return this;
  }

  protected _compileDefinitions: string[] = [];
  protected _includes: string[] = [];
  protected _linkedLibs: string[] = [];
  protected _sources: string[] = [];
  protected _xrepoPackages: XRepoPackage[] = [];
  protected _cxxFlags: string[] = [];
  protected _linkOptions: string[] = [];
  protected _dependencies: Project[] = [];
  protected _cxxStandard: string = "";
  protected _pCXXHeader: string = "";
}
