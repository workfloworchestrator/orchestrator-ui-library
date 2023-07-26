module.exports = {
    resetMocks: true,
    coveragePathIgnorePatterns: [],
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts,tsx}'],
    coverageThreshold: null,
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'esbuild-jest',
        '^.+\\.jsx?$': 'esbuild-jest',
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    name: 'wfo-ui',
    displayName: 'WFO-UI Tests',
};
