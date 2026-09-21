const base = require('@orchestrator-ui/jest-config/jest-base.config.js');
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const customJestConfig = {
  ...base,
  displayName: 'Wfo-UI Tests',
  moduleNameMapper: {
    // Mirrors the "@/*" path alias from tsconfig.json
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
