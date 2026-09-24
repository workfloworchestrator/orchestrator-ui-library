// Dependencies that ship ESM-only builds and must be transformed to CommonJS
// before Jest can require them. next/jest only allows appending to
// transformIgnorePatterns, so consumers replace the list after building their
// config (see the jest.config.cjs files).
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

module.exports = {
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
};
