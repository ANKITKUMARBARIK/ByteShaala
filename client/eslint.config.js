import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import checkFile from "eslint-plugin-check-file";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  {
    ignores: ["dist", "node_modules", ".eslintrc.cjs"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "18.2",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      "check-file": checkFile,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules,

      // General rules
      "no-unused-vars": "warn",
      "no-debugger": "error",
      quotes: ["error", "double"],

      // React rules
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh rules
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // File naming conventions
      // "check-file/folder-naming-convention": [
      //   "error",
      //   { "src/**/": "KEBAB_CASE" },
      // ],
      // "check-file/filename-naming-convention": [
      //   "error",
      //   {
      //     "src/assets/**/*.{png,svg}": "KEBAB_CASE",
      //     "src/{store,utils,hooks}/**/*.js": "CAMEL_CASE",
      //     "src/{components,context,layouts,pages}/**/*.{jsx,js}": "PASCAL_CASE",
      //   },
      // ],
      // "check-file/folder-match-with-fex": [
      //   "error",
      //   {
      //     "*.test.{js,jsx}": "**/__tests__/",
      //     "*.styled.jsx": "**/pages/",
      //   },
      // ],

      // Import rules
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

      // Prettier rules
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          trailingComma: "es5",
        },
      ],

      // Restricted imports (adapted for your project - removed MUI restrictions)
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../**/node_modules/**"],
        },
      ],
    },
  },
];
