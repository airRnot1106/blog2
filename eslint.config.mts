import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import oxlint from 'eslint-plugin-oxlint';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import storybook from 'eslint-plugin-storybook';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'styled-system/**',
    '!.storybook',
  ]),
  reactCompiler.configs.recommended,
  reactYouMightNotNeedAnEffect.configs.recommended,
  // Clean up storybook configs to avoid exactOptionalPropertyTypes issues
  ...storybook.configs['flat/recommended'].map((config) => {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(config)) {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }),
  eslintConfigPrettier,
  // Clean up oxlint configs to avoid exactOptionalPropertyTypes issues
  ...oxlint.buildFromOxlintConfigFile('.oxlintrc.json').map((config) => {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(config)) {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }),
]);

export default eslintConfig;
