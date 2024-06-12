import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts'],
    target: 'es2020',
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
});
