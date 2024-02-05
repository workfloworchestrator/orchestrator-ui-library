module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',
        'next',
        'next/core-web-vitals',
        'prettier',
    ],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
        'no-console': ['error', { allow: ['error'] }],
        'react/react-in-jsx-scope': 2,
        'react/jsx-uses-react': 2,
    },
    parserOptions: {
        babelOptions: {
            presets: [require.resolve('next/babel')],
        },
    },
};
