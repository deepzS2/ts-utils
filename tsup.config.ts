import { defineConfig as tsupDefineConfig, Options } from 'tsup'

export function defineConfig ({
  clean = true,
  bundle = true,
  dts = true,
  format = ['cjs', 'esm'],
  keepNames = true,
  minify = false,
  esbuildPlugins = [],
  entry = ['./src/index.ts'],
  skipNodeModulesBundle = true,
  sourcemap = 'inline',
  target = 'es2020',
  outDir = 'lib',
  silent = true,
  shims = true
}: Options): any {
  return tsupDefineConfig({
    clean,
    bundle,
    dts,
    format,
    keepNames,
    minify,
    esbuildPlugins,
    outDir,
    entry,
    skipNodeModulesBundle,
    sourcemap,
    target,
    silent,
    shims
  })
}
