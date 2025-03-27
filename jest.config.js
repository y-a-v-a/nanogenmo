export default {
  transform: {},
  extensionsToTreatAsEsm: ['.js', '.mjs'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.m?js$': '$1',
  },
  testEnvironment: 'node',
  testMatch: ['**/*.test.mjs'],
};