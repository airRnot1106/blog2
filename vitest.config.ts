import { defineConfig } from 'vitest/config';

export default defineConfig({
  optimizeDeps: {
    include: ['next/cache'],
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}'],
      reporter: ['text', 'html'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
          includeSource: ['src/**/*.{ts,tsx}'],
        },
      },
    ],
  },
});
