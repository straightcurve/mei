import { BaseProject } from "./base";
import { writeFileSync } from "fs";
import { Project } from "./common";

export class Library extends BaseProject {
  public static: boolean = true;

  public get kind(): Project["kind"] {
    return "lib";
  }

  public override async build() {
    this.builder.output.generate(this);

    writeFileSync(`CMakeLists.txt`, this.builder.output.text);

    return this.builder;
  }
}
