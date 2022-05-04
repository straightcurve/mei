import { Builder } from "./index";

export default async function (builder: Builder) {
  await builder
    .addLibrary("lib-test")
    .addDirectory("test/extra")
    .define("EXTRA_USE_LOGGING")
    .link("imgui")
    .build();

  await builder
    .addExecutable("exe-test")
    .addDirectory("test/exe")
    .define("HELLO")
    .include("test/extra/include")
    .link("imgui")
    .link("lib-test")
    .build();

  await builder
    .addExecutable("exe-test2")
    .addDirectory("test/single-exe")
    .define("OF_COURSE")
    .build();
}
