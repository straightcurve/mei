import { spawnSync } from "child_process";
import { SpawnSyncOptions } from "node:child_process";
import { log } from "./log";

export function cmd(
  program: string,
  args: string[],
  options: SpawnSyncOptions
) {
  log.debug("[cmd]", program, args, options);

  const result = spawnSync(program, args, {
    env: process.env,
    ...options,
  });

  if (
    result.stderr &&
    typeof result.stderr === "object" &&
    result.stderr.byteLength > 0
  ) {
    throw new Error(result.stderr.toString());
  } else if (
    result.stderr &&
    typeof result.stderr === "string" &&
    result.stderr.length
  ) {
    throw new Error(result.stderr);
  }

  if (result.stdout) {
    return result.stdout.toString();
  }

  return "";
}
