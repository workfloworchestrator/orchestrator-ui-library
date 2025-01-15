import { dirname, join } from 'path';

import type { StorybookConfig } from '@storybook/react-webpack5';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}

const path = require('path');

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
        getAbsolutePath('@storybook/addon-onboarding'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@chromatic-com/storybook'),
        getAbsolutePath('@storybook/addon-interactions'),
    ],
    framework: {
        name: getAbsolutePath('@storybook/react-webpack5'),
        options: {},
    },
    webpackFinal: async (config) => {
        console.log('Webpack Aliases:', config.resolve.alias); // Debug aliases
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, '../src'),
        };
        config.resolve.fallback = {
            ...config.resolve.fallback,
            zlib: false,
        };

        return config;
    },
};
export default config;
