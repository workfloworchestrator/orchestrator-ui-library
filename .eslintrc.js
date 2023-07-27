module.exports = {
    root: true,
    // This tells ESLint to load the config from the package `eslint-config-custom`
    extends: ['@orchestrator-ui/eslint-config-custom/custom'],
    settings: {
        next: {
            rootDir: ['apps/*/'],
        },
    },
};
