// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig, // Spread the Expo config array
  {
    // Explicitly ignore generated files
    ignores: [
      "**/*.js", 
      "**/*.d.ts",      
      "**/*.js.map",
      "dist/**",
      "node_modules/**",
      ".expo/**"
    ]
  },
  {
    // Custom rules for TypeScript files only
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json" // Point to your TSConfig
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off" // Disable if you want plain apostrophes
    }
  }
]);
