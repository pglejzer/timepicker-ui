# TypeScript Compiler Standards

### Strict Mode
`strict: true`, `noImplicitAny: true`, `forceConsistentCasingInFileNames: true` in tsconfig. Sources: config, docs.

### Modules & Resolution
`module: ESNext`, `moduleResolution: bundler`, `esModuleInterop` + `allowSyntheticDefaultImports` enabled. Source: config.

### Compile Targets
Dev tsconfig targets `es2020` (libs: dom, ESNext, dom.iterable); the production tsup bundle targets `es2022`. Production type build is declarations-only (`emitDeclarationOnly`, `declarationDir: ./dist/types`, `skipLibCheck`). Source: config.
