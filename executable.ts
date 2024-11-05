import { BaseProject } from "./base";
import { writeFileSync } from "fs";
import { Project } from "./common";

export class Executable extends BaseProject {
  public get kind(): Project["kind"] {
    return "exe";
  }

  public override async build() {
    this.builder.output.generate(this);

    writeFileSync(`CMakeLists.txt`, this.builder.output.text);

    return this.builder;
  }
}
