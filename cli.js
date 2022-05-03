#!/usr/bin/env node

const { spawnSync } = require("child_process");
const { join } = require("path");

const runningAsScript = require.main === module;
if (runningAsScript) {
  spawnSync("ts-node", [join(__dirname, "index.ts")], {
    env: process.env,
    stdio: [null, process.stdout, process.stderr],
    encoding: "utf-8",
  });
}
