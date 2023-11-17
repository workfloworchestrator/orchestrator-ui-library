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
        'react/react-in-jsx-scope': 2,
        'react/jsx-uses-react': 2,
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal'],
                pathGroups: [
                    {
                        pattern: 'react',
                        group: 'external',
                        position: 'before',
                    },
                ],
                pathGroupsExcludedImportTypes: ['react'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
    },
    parserOptions: {
        babelOptions: {
            presets: [require.resolve('next/babel')],
        },
    },
    plugins: ['eslint-plugin-import'],
};
