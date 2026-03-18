import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    ignores: [
      'docs/**',
      'dist/**',
      'node_modules/**',
      'rollup.config.js',
      'webpack.config.js',
      'src/**/*.d.ts',
      'docs/index.ts',
      '.eslintrc.js',
      'eslint.config.js',
      'jest.config.ts',
      'tsup.config.ts',
      'tailwind.config.js',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-underscore-dangle': ['error', { allowAfterThis: true }],
      'func-names': 'off',
      'class-methods-use-this': 'off',
      'operator-linebreak': 'off',
      'consistent-return': 'off',
      'no-param-reassign': 'off',
      'import/prefer-default-export': 'off',
      'implicit-arrow-linebreak': 'off',
      'comma-dangle': 'off',
      'function-paren-newline': 'off',
      'wrap-iife': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'linebreak-style': ['error', 'windows'],
      'object-curly-newline': 'off',
      indent: 'off',
      '@typescript-eslint/indent': 'off',
      'max-len': 'off',
      'no-confusing-arrow': 'off',
      'no-unused-vars': 'off',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      'no-nested-ternary': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
);
