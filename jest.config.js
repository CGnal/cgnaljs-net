module.exports = {
    clearMocks: true,
    resetMocks: false,
    collectCoverageFrom: ["src/**/*.js", "!**/{__tests__,__mocks__}/**"],
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    rootDir: ".",
    testEnvironment: "node",
    testRegex: "(/__tests__/.+\\.(test|spec))\\.js$",
    verbose: false,
    watchPathIgnorePatterns: ["<rootDir>/node_modules/"]
};
