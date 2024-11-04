module.exports = {
    extends: [
        'plugin:@typescript-eslint/eslint-plugin/recommended',
        'next',
        'next/core-web-vitals',
        'prettier',
    ],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
        'no-console': ['error', { allow: ['error', 'warn'] }],
        'react/react-in-jsx-scope': 2,
        'react/jsx-uses-react': 2,
    },
    parserOptions: {
        babelOptions: {
            presets: [require.resolve('next/babel')],
        },
    },
    ignorePatterns: ['.turbo/**'],
};
