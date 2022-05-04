import { Builder } from "./index";

export default async function (builder: Builder) {
  await builder
    .addLibrary("test-lib")
    .addFile("**/*.h")
    .addFile("**/*.cpp")
    .define("USE_IMGUI")
    .define("USE_RAYLIB_RENDERER")
    .define("HELLO")
    .include("extra/include")
    .link("imgui")
    .build();

  await builder
    .addExecutable("test-exe")
    .addFile("**/*.h")
    .addFile("**/*.cpp")
    .define("USE_IMGUI")
    .define("USE_RAYLIB_RENDERER")
    .define("HELLO")
    .include("extra/include")
    .link("imgui")
    .build();
}
