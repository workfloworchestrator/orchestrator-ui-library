import { resolve } from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(
                __dirname,
                '../../packages/orchestrator-ui-components/src',
            ),
        },
    },
    build: {
        rollupOptions: {
            external: ['moment'],
        },
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env': {}, // Add anything else needed here
    },
});
