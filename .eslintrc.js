module.exports = {
  parser: '@typescript-eslint/parser', // lets ESLint parse TypeScript
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module', // allows using import/export syntax in TS files
  },
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended', // base ESLint recommended rules
    'plugin:@typescript-eslint/recommended', // recommended rules from the TypeScript ESLint plugin
    'plugin:prettier/recommended', // enables prettier plugin and disables conflicting ESLint rules
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // show prettier issues as ESLint errors
  },
};
