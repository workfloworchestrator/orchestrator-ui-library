const base = require('@orchestrator-ui/jest-config/jest-base.config.js');
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// The entry for "uuid" in the moduleNameMapper can be removed when EUI updates the dependency version to 9.0.0 or higher.
// https://github.com/uuidjs/uuid/blob/main/CHANGELOG.md#900-2022-09-05
const customJestConfig = {
    ...base,
    displayName: 'Wfo-UI Tests',
    moduleNameMapper: {
        '^uuid$': 'uuid',
        '^@copilotkit/react-core/v2$': '<rootDir>/__mocks__/@copilotkit/react-core.js',
    },
};

module.exports = createJestConfig(customJestConfig);
