module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',
        'next',
        'next/core-web-vitals',
        'turbo',
        'prettier',
    ],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
    },
    parserOptions: {
        babelOptions: {
            presets: [require.resolve('next/babel')],
        },
    },
};
