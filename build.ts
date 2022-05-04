import { Builder } from "./index";

export default function (builder: Builder) {
  builder
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
