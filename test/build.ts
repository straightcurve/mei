import { Builder } from "../index";

export default async function (builder: Builder) {
  await builder
    .addLibrary("lib-test")
    .addDirectory("extra")
    .define("EXTRA_USE_LOGGING")
    .link("imgui")
    .build();

  await builder
    .addExecutable("exe-test")
    .addDirectory("exe")
    .define("HELLO")
    .include("extra/include")
    .link("imgui")
    .link("lib-test")
    .build();

  await builder
    .addExecutable("exe-test2")
    .addDirectory("single-exe")
    .define("OF_COURSE")
    .build();
}
