# mei
Simple C++ build system because I hate CMake

## Usage

### Generate new project

```bash
$ npx @sweetacid/mei --new mei-is-cool
[CREATE] mei-is-cool/src/main.cpp
[CREATE] mei-is-cool/build.ts
[EXECUTE] g++ mei-is-cool/src/main.cpp -o mei-is-cool
[CREATE] mei-is-cool
```

### Edit generated build.ts file

```typescript
//  mei-is-cool/build.ts

export default async function (builder: Builder) {
  await builder
    .addExecutable("mei-is-cool")
    .addDirectory("src")
    .define("MEI_IS_REALLY_COOL")
    .build();
}
```

### Build

```bash
$ npx @sweetacid/mei
[EXECUTE] g++ mei-is-cool/src/main.cpp -DMEI_IS_REALLY_COOL -o mei-is-cool
[CREATE] mei-is-cool

$ ./mei-is-cool
generated with mei :3
```
