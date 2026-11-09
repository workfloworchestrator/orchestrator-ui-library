const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Dependencies that ship ESM-only builds and must be transformed to CommonJS
// before Jest can require them.
const esmDependencies = [
  'next-intl',
  'use-intl',
  'intl-messageformat',
  '@formatjs/.*',
  '@apidevtools/json-schema-ref-parser',
];

const transformIgnorePatterns = [
  `/node_modules/(?!(${esmDependencies.join('|')})/)`,
  '^.+\\.module\\.(css|sass|scss)$',
];

const customJestConfig = {
  displayName: 'Wfo-UI Tests',
  transformIgnorePatterns,
  resetMocks: true,
  coveragePathIgnorePatterns: [],
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts,tsx}'],
  coverageThreshold: null,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    // Mirrors the "@/*" path alias from tsconfig.json
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

// next/jest only allows appending to transformIgnorePatterns, so the list is
// restored afterwards to let ESM-only dependencies through.
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();

  config.transformIgnorePatterns = transformIgnorePatterns;

  return config;
};
