import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const requireAssertion = require('./eslint-rules/require-assertion.js');

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'playwright': playwright,
      'custom': {
        rules: {
          'require-assertion': requireAssertion,
        },
      },
    },
    rules: {
      // Playwright Best Practices
      'playwright/no-skipped-test': 'warn',
      'playwright/no-focused-test': 'error',
      'playwright/valid-expect': 'error',
      'playwright/prefer-web-first-assertions': 'warn',
      'playwright/no-useless-await': 'error',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-element-handle': 'warn',
      'playwright/no-eval': 'error',
      'playwright/no-page-pause': 'warn',
      'playwright/no-useless-not': 'warn',
      'playwright/no-conditional-in-test': 'warn',
      'playwright/no-networkidle': 'warn',

      // TypeScript Best Practices
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',

      // General Best Practices
      'no-console': 'off',
      'no-unused-vars': 'off', // Use @typescript-eslint/no-unused-vars instead
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-throw-literal': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'playwright/no-conditional-in-test': 'error',
      // Disable playwright's expect-expect rule
      'playwright/expect-expect': 'off',
      // Use our custom rule that detects verify*, assert*, check*, waitFor*
      'custom/require-assertion': 'error',
    },
  },
  {
    // Enums - ignore unused members (they're exported for use elsewhere)
    files: ['**/enum/*.ts', '**/*.enum.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: [
      'node_modules/',
      'test-results/',
      'playwright-report/',
      'playwright/.cache/',
      'blob-report/',
      '.auth/',
      'dist/',
      'build/',
      'eslint-rules/',  // Ignore custom ESLint rule files
    ],
  },
];
