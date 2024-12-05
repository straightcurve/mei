import { Builder } from "../index";

const packages = [
  "glfw",
  "glm",
  "stb",
  "fmt",
  "entt",
  "vulkan-memory-allocator",
  "vk-bootstrap",
  "imgui docking",
  "fastgltf",
  "yaml-cpp",
  "nativefiledialog-extended",
  "taskflow",
  "concurrentqueue",
  "stduuid",
  "dylib",
  "libuv",
  "glob [header_only=true]",
];

const defines = [
  "GLFW_INCLUDE_VULKAN",
  "GLM_ENABLE_EXPERIMENTAL",
  "GLM_FORCE_DEPTH_ZERO_TO_ONE",
  "GLM_FORCE_RADIANS",
  "IMGUI_DEFINE_MATH_OPERATORS",
  "DAWN_USE_DRAW_INDIRECT",
  "DAWN_USE_EXCEPTIONS",
  "GLFW_INCLUDE_NONE",
];

const cxxFlags = [
  "-m64",
  "-std=c++20",
  "-msse2",
  "-fPIC",
  "-fexceptions",
  "-g",
  "-DDEBUG",
  "-Werror=return-type",
  "-mfpmath=sse",
];

export default async function (builder: Builder) {
  const physics = "jolt";
  const editor = true;
  const useDrawIndirect = true;

  if (editor) {
    defines.push("DAWN_EDITOR");
  }

  if (useDrawIndirect) {
    defines.push("DAWN_USE_DRAW_INDIRECT");
  }

  if (physics === "jolt") {
    packages.push("joltphysics");
    defines.push(
      "DAWN_USE_JOLT",
      "JPH_OBJECT_LAYER_BITS=16",
      "JPH_PROFILE_ENABLED",
      "JPH_DEBUG_RENDERER",
      "JPH_NO_DEBUG",
      "JPH_OBJECT_STREAM"
    );
  }

  const dawn = builder
    .addLibrary("dawn")
    .include("extra")
    .addPackages(...packages)
    .define(...defines)
    .setCXXFlags(...cxxFlags)
    .setCXXStandard("20")
    .setLinkOptions("-m64")
    .link("stdc++", "m", "vulkan", "dbus-1")
    .addDirectory("extra");
  await dawn.build();

  const exe = builder
    .addExecutable("project_template")
    .dependOn(dawn)
    .include("extra", "exe")
    .addPackages(...packages)
    .define(...defines)
    .setCXXFlags(...cxxFlags)
    .setCXXStandard("20")
    .setLinkOptions("-m64")
    .addDirectory("exe");
  await exe.build();
}
