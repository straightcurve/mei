import { BaseProject } from "./base";
import { writeFileSync } from "fs";
import { Project } from "./common";
import path from "node:path";

export class Executable extends BaseProject {
  public get kind(): Project["kind"] {
    return "exe";
  }

  public override async build() {
    for (let i = 0; i < this.dependencies.length; i++) {
      for (const dep of this.dependencies) {
        if (dep.subdirectory) {
          this.builder.output.addLine(`add_subdirectory(${dep.subdirectory})`);
        }
      }
    }

    await this.builder.output.generate(this);

    if (this.subdirectory) {
      writeFileSync(
        path.join(this.subdirectory, `CMakeLists.txt`),
        this.builder.output.text
      );
    } else {
      writeFileSync(
        path.join(this.builder.baseDir, `CMakeLists.txt`),
        this.builder.output.text
      );
    }

    return this.builder;
  }
}
