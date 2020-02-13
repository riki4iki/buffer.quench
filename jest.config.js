module.exports = {
   collectCoverage: false,
   moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],

   collectCoverageFrom: ["**/*.{ts,js}", "!**/node_modules/**", "!**/build/**", "!**/coverage/**"],
   transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
   },
   coverageReporters: ["text", "text-summary"],
   testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$",
   testPathIgnorePatterns: ["/node_modules/", "/build/", "/coverage/"],
   moduleNameMapper: {
      "^types(.*)$": "<rootDir>/src/types$1",
      "^config(.*)$": "<rootDir>/src/config$1",
      "^service(.*)$": "<rootDir>/src/service$1",
      "^lib(.*)$": "<rootDir>/src/lib$1",
      "^models(.*)$": "<rootDir>/src/models$1",
   },
};
