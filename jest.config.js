/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: { strict: false, types: ['jest', 'node'] } }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
};
