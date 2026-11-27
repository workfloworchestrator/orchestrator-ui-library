import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

import js from '@eslint/js';

export default defineConfig([
  globalIgnores([
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.next',
    'next.config.js',
    'next-env.d.ts',
    'storybook-static',
  ]),
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-console': ['error', { allow: ['error', 'warn'] }],
    },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error', // Enforce Rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Enforce exhaustive deps in effects
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { typescriptEslint },
    extends: ['typescriptEslint/recommended'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
  {
    // Storybook shows the design system only, so stories never use EUI.
    files: ['**/*.stories.tsx', '.storybook/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['@elastic/eui', '@elastic/eui/*'], message: 'Stories show the design system only.' }] },
      ],
    },
  },
  {
    // Layers: tokens -> ui -> components -> pages. The design system knows nothing about the app or EUI.
    files: ['src/tokens/**', 'src/ui/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/components',
                '@/components/*',
                '@/pages',
                '@/pages/*',
                '@/rtk',
                '@/rtk/*',
                '@/hooks',
                '@/hooks/*',
              ],
              message: 'UI parts get their data from props. Move app logic to src/components.',
            },
            {
              group: ['@elastic/eui', '@elastic/eui/*', '@emotion/*'],
              message: 'The design system uses CSS modules and tokens, not EUI or Emotion.',
            },
            {
              group: ['next', 'next/*', 'next-intl', 'next-auth', 'next-auth/*'],
              message: 'The design system does not depend on Next.js. Pass text and links in by props.',
            },
          ],
        },
      ],
    },
  },
  {
    plugins: {
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'error',
      'react/jsx-uses-react': 'error',
    },
  },
  prettier,
]);
