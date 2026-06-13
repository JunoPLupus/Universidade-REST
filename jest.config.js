/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/*.spec.ts'],
  clearMocks: true,
  coveragePathIgnorePatterns: ['/node_modules/', '\\.spec\\.ts$'],
};
