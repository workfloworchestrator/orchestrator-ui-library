import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      // Same "@/*" alias as tsconfig.json
      alias: { ...viteConfig.resolve?.alias, '@': fileURLToPath(new URL('../src', import.meta.url)) },
    },
  }),
};

export default config;
