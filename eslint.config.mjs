import js from '@eslint/js';
import pluginCypress from 'eslint-plugin-cypress';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'integration-tests/screenshots/', 'integration-tests/videos/'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // A warning in typescript-eslint 5, where this config started.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['integration-tests/**'],
    ...pluginCypress.configs.recommended,
    languageOptions: {
      globals: { ...globals.node, ...pluginCypress.configs.globals.languageOptions.globals },
    },
    rules: {
      ...pluginCypress.configs.recommended.rules,
      'no-console': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
);
