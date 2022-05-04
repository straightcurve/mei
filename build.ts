import { Builder } from "./index";

export default async function (builder: Builder) {
  await builder
    .addLibrary("test-lib")
    .addDirectory("test/extra")
    .define("EXTRA_USE_LOGGING")
    .link("imgui")
    .build();

  await builder
    .addExecutable("test-exe")
    .addDirectory("test/exe")
    .define("HELLO")
    .include("test/extra/include")
    .link("imgui")
    .link("test-lib")
    .build();
}
