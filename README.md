# mei

~~Simple C++ build system because I hate CMake~~

i still hate CMake but **mei** is now a generator for CMake configs

## TODO

- [ ] ~~Switch to clang~~
- [ ] ~~Generate compile commands instead of compiling
  using [clang -Mj option](http://bcain-llvm.readthedocs.io/projects/clang/en/latest/ClangCommandLineReference/#cmdoption-clang-mj-arg)~~
- [ ] Other things I will find a need for
    - [x] Generate `CMakeLists.txt` files
    - [x] Support [xrepo](https://xrepo.xmake.io/) packages
    - [ ] Avoid creating an npm project (ship types somehow)

## Usage

### Create a New Project

To create a new project with the name **mei-is-cool**, run the following command:

```bash
$ npx @sweetacid/mei -n mei-is-cool
[CREATE] mei-is-cool/src/main.cpp
[CREATE] mei-is-cool/build.ts
```

This will generate a new directory `mei-is-cool` with the following files:

* `src/main.cpp` – example source file
* `build.ts` – build configuration file (we'll edit this next)

### OR

### Add Config to an Existing Project

If you want to add the config to an existing project, navigate to your project directory and run:

```bash
$ npx @sweetacid/mei -c
up to date, audited 21 packages in 2s

found 0 vulnerabilities
[CREATE] build.ts
```

This will add a `build.ts` file to your project directory that configures the build process.

---

### Edit the Generated `build.ts` file

```typescript
//  mei-is-cool/build.ts

export default async function (builder: Builder) {
    await builder
        .addExecutable("mei-is-cool")      // Define the executable name
        .addDirectory("src")               // Add the source directory
        .define("MEI_IS_REALLY_COOL")      // Define a preprocessor macro
        .build();                          // Trigger the build process
}
```

You can modify this file to suit your project's needs. For example, you can add more source directories, define
additional macros, or configure other build options. Check out the [test](test/) folder in this repository for examples.

---

### Generate CMakeLists.txt

To generate the CMakeLists.txt configuration for your project, simply run:

```bash
$ npx @sweetacid/mei
# no output means all went well
# check out CMakeLists.txt in the project's directory
```
