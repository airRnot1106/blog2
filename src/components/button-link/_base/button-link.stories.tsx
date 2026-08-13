import preview from '../../../../.storybook/preview';
import { ButtonLink } from './button-link';

const meta = preview.meta({
  component: ButtonLink,
  tags: ['autodocs'],
  args: {
    children: 'Button link',
    variant: 'solid',
    href: 'https://example.com',
  },
});

export const Solid = meta.story({
  args: {
    variant: 'solid',
    href: 'https://example.com',
  },
});

export const Outline = meta.story({
  args: {
    variant: 'outline',
    href: 'https://example.com',
  },
});

export const Ghost = meta.story({
  args: {
    variant: 'ghost',
    href: 'https://example.com',
  },
});

export const Small = meta.story({
  args: {
    variant: 'solid',
    href: 'https://example.com',
    size: 'sm',
  },
});

export const Medium = meta.story({
  args: {
    variant: 'solid',
    href: 'https://example.com',
    size: 'md',
  },
});

export const Large = meta.story({
  args: {
    variant: 'solid',
    href: 'https://example.com',
    size: 'lg',
  },
});

export const CustomRadius = meta.story({
  args: {
    variant: 'solid',
    href: 'https://example.com',
    style: {
      '--button-link--radius': '999px',
    },
  },
});

export const External = meta.story({
  args: {
    variant: 'outline',
    href: 'https://example.com',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
});
