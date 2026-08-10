import { defineConfig } from 'oxfmt';

export default defineConfig({
  semi: true,
  singleQuote: true,
  sortImports: {
    groups: [
      ['type-builtin', 'value-builtin'],
      ['type-external', 'type-internal', 'value-external', 'value-internal'],
      [
        'type-index',
        'type-parent',
        'type-sibling',
        'value-index',
        'value-parent',
        'value-sibling',
        'style',
      ],
      ['side_effect_style', 'side_effect'],
      ['unknown'],
    ],
    newlinesBetween: true,
    order: 'asc',
  },
  sortPackageJson: true,
  trailingComma: 'all',
});
