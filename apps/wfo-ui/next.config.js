module.exports = {
    reactStrictMode: false,
    i18n: {
        // These are all the locales you want to support in
        // your application
        locales: ['en-US', 'nl-NL'],
        defaultLocale: 'en-US',
    },
    transpilePackages: ['@orchestrator-ui/orchestrator-ui-components'],
    async redirects() {
        return [
            {
                source: '/metadata',
                destination: '/metadata/products',
                permanent: true,
            },
        ];
    },
};
