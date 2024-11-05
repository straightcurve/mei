import { TextEmitter } from "./text_emitter";
import { Builder } from "./common";
import { BaseProject } from "./base";
import { Library } from "./library";

export class CMakeEmitter extends TextEmitter {
  constructor(public builder: Builder) {
    super();
  }

  public generate(project: BaseProject) {
    let output = this.builder.output;

    output.addLine(`project(${project.name})`);

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
        `target_precompile_headers(${project.name} PRIVATE ${project.pCXXHeader})`
      );
    }

    if (project.dependencies.length) {
      output.addLine(`add_dependencies(${project.name}`);
      for (const dep of project.dependencies) {
        output.addLine(`  ${dep.name}`);
      }
      output.addLine(`)`);
    }

    if (project.includes.length) {
      output.addLine(`target_include_directories(${project.name} PRIVATE`);
      for (const includeDir of project.includes) {
        output.addLine(`  ${includeDir}`);
      }
      output.addLine(`)`);
    }

    if (project.xrepoPackages.some((p) => p.includedirs.length)) {
      output.addLine(
        `target_include_directories(${project.name} SYSTEM PRIVATE`
      );
      for (const pkg of project.xrepoPackages) {
        for (const includeDir of pkg.includedirs) {
          output.addLine(`  ${includeDir}`);
        }
      }
      output.addLine(`)`);
    }

    if (project.compileDefinitions.length) {
      output.addLine(`target_compile_definitions(${project.name} PRIVATE`);
      for (const def of project.compileDefinitions) {
        output.addLine(`  ${def}`);
      }
      output.addLine(`)`);
    }

    if (project.cxxFlags.length) {
      output.addLine(`target_compile_options(${project.name} PRIVATE`);
      for (const flag of project.cxxFlags) {
        output.addLine(`  ${flag}`);
      }
      output.addLine(`)`);
    }

    if (
      project.linkedLibs.length ||
      project.xrepoPackages.some((p) => p.links.length)
    ) {
      output.addLine(`target_link_libraries(${project.name} PRIVATE`);
      for (const pkg of project.xrepoPackages) {
        if (!pkg.links) {
          continue;
        }

        for (const lib of pkg.links) {
          output.addLine(`  ${lib}`);
        }
      }

      for (const lib of project.linkedLibs) {
        output.addLine(`  ${lib}`);
      }

      for (const dep of project.dependencies) {
        output.addLine(`  ${dep.name}`);
      }
      output.addLine(`)`);
    }

    if (project.xrepoPackages.some((p) => p.linkdirs.length)) {
      output.addLine(`target_link_directories(${project.name} PRIVATE`);
      for (const pkg of project.xrepoPackages) {
        if (!pkg.linkdirs) {
          continue;
        }

        for (const dir of pkg.linkdirs) {
          output.addLine(`  ${dir}`);
        }
      }
      output.addLine(`)`);
    }

    if (project.linkOptions.length) {
      output.addLine(`target_link_options(${project.name} PRIVATE`);
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
