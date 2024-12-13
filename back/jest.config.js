module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "models/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/__mocks__/**",
  ],
};
//  npm run test:coverage  // TO RUN TEST COVERAGE ...
 