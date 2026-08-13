import preview from '../../../../.storybook/preview';
import { token } from '../../../../styled-system/tokens';
import { Link } from './link';

const meta = preview.meta({
  component: Link,
  tags: ['autodocs'],
  args: {
    children: 'Link',
    variant: 'underline',
    href: 'https://example.com',
  },
});

export const Underline = meta.story({
  args: {
    variant: 'underline',
    href: 'https://example.com',
  },
});

export const CustomColor = meta.story({
  args: {
    variant: 'underline',
    href: 'https://example.com',
    style: {
      '--link--color': token.var('colors.iris'),
      '--link--font-size': token.var('fontSizes.xl'),
      '--link--font-weight': 'bold',
    },
  },
});

export const CustomFontSize = meta.story({
  args: {
    variant: 'underline',
    href: 'https://example.com',
    style: {
      '--link--font-size': token.var('fontSizes.xl'),
    },
  },
});

export const CustomFontWeight = meta.story({
  args: {
    variant: 'underline',
    href: 'https://example.com',
    style: {
      '--link--font-weight': 'bold',
    },
  },
});
