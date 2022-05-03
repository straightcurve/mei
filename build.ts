import { Builder } from "./index";

export default async function (builder: Builder) {
  builder.addFile("**/*.h").addFile("**/*.cpp");

  builder.define("USE_IMGUI").define("USE_RAYLIB_RENDERER").define("HELLO");
  builder.include("extra/include");

  builder.link("imgui").build();
}
