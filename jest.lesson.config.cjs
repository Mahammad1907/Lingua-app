// Optional UI regression suite. See docs/LESSON_REPAIR_20261023.md for tooling.
module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/screen-tests/*.screen.test.js'],
  testTimeout: 30000,
  clearMocks: true,
};
