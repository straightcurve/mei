# mei
Simple C++ build system because I hate CMake

## 1. Create new project
```bash
$ mkdir project-folder
$ cd project-folder
$ npm init -y
$ npm i @sweetacid/mei
```

## 2. Run mei

```bash
$ pwd
/path-to-project-folder
$ mei
```

## 3. Edit generated build.ts file

```typescript
//  project-folder/build.ts

export default async function (builder: Builder) {
  //  any .cpp and .h from current directory and subdirectories
  builder.addFile("**/*.h").addFile("**/*.cpp");

  builder.define("SOME_COMPILE_DEFINITION").define("HELLO_WORLD");
  builder.include("relative-path-to-an-include-folder");

  builder.link("some_system_library").build();
}
```

## 4. Run mei

```bash
$ pwd
/path-to-project-folder
$ mei
```
