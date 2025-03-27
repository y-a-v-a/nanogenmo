export default {
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.m?js$': '$1',
  },
  testEnvironment: 'node',
  testMatch: ['**/*.test.mjs'],
};
