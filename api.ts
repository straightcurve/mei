import { XRepoPackage } from "./common";
import { cmd } from "./utils";

const xrepoFetchCache: Record<string, XRepoPackage> = {};

export const xrepo = {
  fetch: (name: string) => {
    if (xrepoFetchCache[name]) {
      return xrepoFetchCache[name];
    }

    const json: XRepoPackage[] = JSON.parse(
      cmd("xrepo", ["fetch", "--json", name], {})
    );

    if (json.length === 0) {
      throw new Error(`[xrepo][fetch] unknown package: ${name}`);
    }

    const pkg = json[0];
    xrepoFetchCache[name] = pkg;
    return pkg;
  },
};
