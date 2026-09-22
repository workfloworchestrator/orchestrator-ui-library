import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../src/**/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // addon-essentials and addon-interactions were folded into Storybook core in v10.
  addons: ['@chromatic-com/storybook'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  typescript: {
    reactDocgen: false,
  },
};
export default config;
