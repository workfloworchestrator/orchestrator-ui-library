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
  // CSS modules: class names are scoped per file. :root and --custom-properties (the design tokens) stay global.
  // All CSS ends up in dist/index.css. The banner imports it from dist/index.js, so apps get it automatically,
  // the same way the library already ships CSS of its dependencies. If "sideEffects" is ever set in
  // package.json, it must keep "*.css", or bundlers drop this import.
  loader: { '.css': 'local-css' },
  banner: { js: "import './index.css';" },
}));
