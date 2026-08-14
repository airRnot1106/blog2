import { storybookMockServerFunctions } from '@akfm/vite-plugin-storybook-mock-server-functions';
import { defineMain } from '@storybook/nextjs-vite/node';
import svgr from 'vite-plugin-svgr';

export default defineMain({
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
    '@storybook/addon-themes',
  ],
  features: {
    experimentalRSC: true,
  },
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      // @storybook/nextjs-vite's own Next-Image emulation also claims
      // `.svg`, turning imports into `{ src, width, height }` objects. Cede
      // all `.svg` to vite-plugin-svgr below so the bare-import-as-component
      // convention from next.config.ts's `turbopack.rules` holds here too.
      image: {
        excludeFiles: ['**/*.svg'],
      },
    },
  },
  staticDirs: ['../public'],
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  viteFinal: (viteConfig) => {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(storybookMockServerFunctions());
    // Mirrors the `turbopack.rules` SVGR setup in next.config.ts: bare
    // `.svg` imports become React components, `.svg?url` stays a URL.
    viteConfig.plugins.push(svgr({ include: '**/*.svg' }));
    return viteConfig;
  },
});
