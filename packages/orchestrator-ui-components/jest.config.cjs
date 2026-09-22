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

// next/jest only allows appending to transformIgnorePatterns, so the list from
// the base config is restored afterwards to let ESM-only dependencies through.
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();

  config.transformIgnorePatterns = base.transformIgnorePatterns;

  return config;
};
