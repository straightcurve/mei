import { TextEmitter } from "./text_emitter";
import { Builder } from "./common";
import { BaseProject } from "./base";
import { Library } from "./library";
import { join } from "path";
import { existsSync } from "fs";
import { log } from "./log";
import { DefaultBuilder } from "./builder";
import { cwd } from "process";

export class CMakeEmitter extends TextEmitter {
  constructor(public builder: Builder) {
    super();
  }

  public emitXMakeDownloadScript() {
    let output = this.builder.output;

    output.addLine(`
# Download xrepo.cmake if not exists in build directory.
if (NOT EXISTS "\${CMAKE_BINARY_DIR}/xrepo.cmake")
    message(STATUS "Downloading xrepo.cmake from https://github.com/xmake-io/xrepo-cmake/")
    # mirror https://cdn.jsdelivr.net/gh/xmake-io/xrepo-cmake@main/xrepo.cmake
    file(DOWNLOAD "https://raw.githubusercontent.com/xmake-io/xrepo-cmake/main/xrepo.cmake"
            "\${CMAKE_BINARY_DIR}/xrepo.cmake"
            TLS_VERIFY ON)
endif ()

# Include xrepo.cmake so we can use xrepo_package function.
include(\${CMAKE_BINARY_DIR}/xrepo.cmake)
    `);
  }

  public async generate(project: BaseProject) {
    let output = this.builder.output;

    if (project.subdirectory) {
      const configPath = join(cwd(), project.subdirectory, "build.ts");
      if (!existsSync(configPath)) {
        log.error(
          `no mei project found in subdirectory "${project.subdirectory}"`
        );

        process.exit(1);
      }

      const config = require(configPath);
      if (typeof config.default !== "function") {
        log.error(
          `make sure you export a default function from the build.ts file in ${project.subdirectory}!`
        );

        process.exit(1);
      }

      await config.default(new DefaultBuilder(project.subdirectory));
      return;
    }

    for (const pkg of project.xrepoPackages) {
      if (pkg.config.options.length > 0) {
        output.addLine(
          `xrepo_package("${pkg.config.name}" CONFIGS "${pkg.config.options.join(",")}")`
        );
      } else {
        output.addLine(`xrepo_package("${pkg.config.name}")`);
      }
    }

    if (project.cxxStandard) {
      output.addLine(`set(CMAKE_CXX_STANDARD ${project.cxxStandard})`);
    }

    if (project.kind === "lib") {
      output.addLine(
        `add_library(${project.name} ${(project as Library).static ? "STATIC" : "SHARED"} "")`
      );
    } else if (project.kind === "exe") {
      output.addLine(`add_executable(${project.name} "")`);
    }

    output.addLine(
      `set_target_properties(${project.name} PROPERTIES OUTPUT_NAME "${project.name}")`
    );

    if (project.pCXXHeader) {
      output.addLine(
        `target_precompile_headers(${project.name} PUBLIC ${project.pCXXHeader})`
      );
    }

    if (project.xrepoPackages.length > 0) {
      let str = `xrepo_target_packages(${project.name}`;
      for (const pkg of project.xrepoPackages) {
        str += ` ${pkg.config.name}`;
      }
      str += `)`;

      output.addLine(str);
    }

    if (project.dependencies.length) {
      output.addLine(`add_dependencies(${project.name}`);
      for (const dep of project.dependencies) {
        output.addLine(`  ${dep.name}`);
      }
      output.addLine(`)`);
    }

    if (project.includes.length) {
      output.addLine(`target_include_directories(${project.name} PUBLIC`);

      for (const includeDir of project.includes) {
        output.addLine(`  ${includeDir}`);
      }

      output.addLine(`)`);
    }

    if (project.compileDefinitions.length) {
      output.addLine(`target_compile_definitions(${project.name} PUBLIC`);
      for (const def of project.compileDefinitions) {
        output.addLine(`  ${def}`);
      }
      output.addLine(`)`);
    }

    if (project.cxxFlags.length) {
      output.addLine(`target_compile_options(${project.name} PUBLIC`);
      for (const flag of project.cxxFlags) {
        output.addLine(`  ${flag}`);
      }
      output.addLine(`)`);
    }

    if (project.linkedLibs.length || project.dependencies.length) {
      output.addLine(`target_link_libraries(${project.name} PUBLIC`);

      for (const lib of project.linkedLibs) {
        output.addLine(`  ${lib}`);
      }

      for (const dep of project.dependencies) {
        output.addLine(`  ${dep.name}`);
      }

      output.addLine(`)`);
    }

    if (project.linkOptions.length) {
      output.addLine(`target_link_options(${project.name} PUBLIC`);
      for (const option of project.linkOptions) {
        output.addLine(`  ${option}`);
      }
      output.addLine(`)`);
    }

    if (project.sources.length) {
      output.addLine(`target_sources(${project.name} PRIVATE`);
      for (const option of project.sources) {
        output.addLine(`  ${option}`);
      }
      output.addLine(`)`);
    }
  }
}
