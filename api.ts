import { XRepoPackage } from "./common";
import { cmd } from "./utils";
import { log } from "./log";

const xrepoFetchCache: Record<string, XRepoPackage> = {};

export const xrepo = {
  fetch: (name: string) => {
    if (xrepoFetchCache[name]) {
      return xrepoFetchCache[name];
    }

    const fragments = name.split(" ");
    name = fragments[0];

    const configOptionsIndex = fragments.findIndex(
      (f) => f.startsWith("[") && f.endsWith("]")
    );
    const configOptions = fragments[configOptionsIndex];

    const branchIndex = 1;
    let branch: string | null = null;
    if (configOptionsIndex !== branchIndex) {
      branch = fragments[branchIndex];
    }

    let json: XRepoPackage[];

    try {
      const commandArgs = ["fetch"];
      if (configOptions) {
        const options = configOptions
          .slice(1, configOptions.length - 1)
          .split(",")
          .map((o) => o.trim());
        commandArgs.push("-f", options.join(","));
      }

      commandArgs.push("--json");

      if (branch) {
        commandArgs.push(`${name} ${branch}`);
      } else {
        commandArgs.push(name);
      }

      const output = cmd("xrepo", commandArgs, {});
      if (output.length === 0) {
        log.error(`[xrepo][fetch] unknown package: ${name}`);
        process.exit(1);
      }

      json = JSON.parse(output);
    } catch (error) {
      log.error(`[xrepo][fetch] failed parsing json for: ${name}`);
      log.error(error);
      process.exit(1);
    }

    const pkg = json[0];
    xrepoFetchCache[name] = pkg;
    return pkg;
  },
};
