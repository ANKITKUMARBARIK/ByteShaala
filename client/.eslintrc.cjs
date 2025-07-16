module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "import", "check-file", "prettier"],
  rules: {
    "no-unused-vars": "warn",
    "check-file/folder-naming-convention": "off",
    "check-file/filename-naming-convention": "off",
    "no-empty-pattern": "off",
    "react/prop-types": "warn",
    "react/jsx-no-target-blank": "off",
    // "check-file/folder-naming-convention": [
    //   "error",
    //   { "src/**/": "KEBAB_CASE" },
    // ],
    // "check-file/filename-naming-convention": [
    //   "error",
    //   {
    //     "src/assets/**/*.{png,svg}": "KEBAB_CASE",
    //     "src/{store,utils,hooks}/**/*.{js,ts}": "CAMEL_CASE",
    //     "src/{components,context,layouts,pages}/**/*.{jsx,tsx,js,ts}":
    //       "PASCAL_CASE",
    //   },
    // ],
    // "check-file/folder-match-with-fex": [
    //   "error",
    //   {
    //     "*.test.{js,jsx,ts,tsx}": "**/__tests__/",
    //     "*.styled.{jsx,tsx}": "**/pages/",
    //   },
    // ],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "no-debugger": "error",
    quotes: ["error", "double"],
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "object",
          "type",
          "sibling",
          "parent",
          "internal",
          "index",
        ],
        pathGroups: [
          { pattern: "react", group: "external", position: "before" },
          { pattern: "**", group: "internal", position: "after" },
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: ["@mui/*/*/*", "!@mui/material/test-utils/*"],
      },
    ],
  },
};
