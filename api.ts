import { XRepoPackage } from "./common";

const xrepoFetchCache: Record<string, XRepoPackage> = {};

export const xrepo = {
  getPkgConfig(pkgString: string) {
    const fragments = pkgString.split(" ");

    const optionsIndex = fragments.findIndex(
      (f) => f.startsWith("[") && f.endsWith("]")
    );
    const optionsString = optionsIndex > -1 ? fragments[optionsIndex] : "";

    const branchIndex = 1;
    let branch: string | null = null;
    if (optionsIndex !== branchIndex) {
      branch = fragments[branchIndex];
    }

    const options =
      optionsIndex > -1
        ? optionsString
            .slice(1, optionsString.length - 1)
            .split(",")
            .map((o) => o.trim())
        : [];

    return {
      name: fragments[0],
      branch,
      options,
    };
  },

  fetch(name: string) {
    if (xrepoFetchCache[name]) {
      return xrepoFetchCache[name];
    }

    const config = this.getPkgConfig(name);
    const pkg = {} as XRepoPackage;
    pkg.config = config;
    xrepoFetchCache[name] = pkg;
    return pkg;
  },
};
