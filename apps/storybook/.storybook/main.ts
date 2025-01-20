import { dirname, join } from 'path';

import type { StorybookConfig } from '@storybook/react-vite';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
    stories: [
        '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        '../src/**/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],
    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@chromatic-com/storybook'),
        getAbsolutePath('@storybook/addon-interactions'),
        // getAbsolutePath('@storybook-addon-next-router'),
        // getAbsolutePath('@storybook/addon-next'),
        {
            name: '@storybook/addon-essentials',
            options: { docs: false },
        },
    ],
    framework: {
        name: getAbsolutePath('@storybook/experimental-nextjs-vite'),
        options: {},
    },
    typescript: {
        reactDocgen: false,
    },
};
export default config;

// module.exports = {
//     typescript: {
//         reactDocgen: 'react-docgen'
//     }
// }
