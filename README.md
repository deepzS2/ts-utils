<h1 align="center">Typescript Utilities</h1>
<p align="center">Typescript Utilities is a monorepo dedicated to some packages that can be useful during the development of a TypeScript project.</p>

## Motivations

In my experiences with other programming languages like Rust, some of their features caught my attention. Because of that, I tried to replicate them within Node.js using TypeScript, such as Rust's Option and Rust's Result.

## Packages

For each package present in this monorepo, its installation can be done using the following format: `@deepzs/<package>`. Here's an example of how to install a package using different Node.js package managers:

```bash
# Just replace the `<package>` with the specific package name you want to install
# Using NPM
npm install @deepzs/<package>
# Using Yarn
yarn add @deepzs/<package>
# Or using PNPM
pnpm add @deepzs/<package>
```

- [TRustScript](packages/trustscript/README.md): `@deepzs/trustscript`
