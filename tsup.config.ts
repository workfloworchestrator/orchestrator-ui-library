import { defineConfig } from 'tsup';

export default defineConfig((opts) => ({
  entry: ['src/index.ts'],
  sourcemap: true,
  splitting: false,
  clean: !opts.watch,
  dts: true,
  outDir: 'dist',
  format: ['esm'],
  platform: 'node',
  target: 'es2022',
  skipNodeModulesBundle: true,
}));
