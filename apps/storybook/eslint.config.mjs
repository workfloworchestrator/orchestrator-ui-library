import storybook from 'eslint-plugin-storybook';
import { defineConfig } from 'eslint/config';

import wfoConfig from '@orchestrator-ui/eslint-config-custom';

export default defineConfig([
    wfoConfig,
    ...storybook.configs['flat/recommended'],
]);
