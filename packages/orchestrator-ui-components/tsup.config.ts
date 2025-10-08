import { defineConfig } from 'tsup';

export default defineConfig({
    target: 'es2020',
    format: ['esm'],
    splitting: false,
    sourcemap: true,
    dts: true,
    tsconfig: 'tsconfig.build.json',
});
