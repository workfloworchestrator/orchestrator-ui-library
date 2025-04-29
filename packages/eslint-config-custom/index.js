import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

import js from '@eslint/js';

export default defineConfig([
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
        plugins: { 'typescript-eslint': typescriptEslint },
        extends: ['typescript-eslint/recommended'],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'warn',
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
