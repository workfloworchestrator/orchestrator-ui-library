import { defineConfig } from 'tsup';

export default defineConfig((opts) => ({
  entry: ['src/index.ts'],
  sourcemap: true,
  splitting: false,
  clean: !opts.watch,
  dts: !opts.watch,
  outDir: 'dist',
  format: ['esm'],
  platform: 'node',
  target: 'es2022',
  skipNodeModulesBundle: true,
}));
