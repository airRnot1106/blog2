import Link from 'next/link';
import type { ComponentProps, FC } from 'react';

import { styled } from '../../../../styled-system/jsx';

export type ButtonLinkVariant = 'ghost' | 'outline' | 'solid';
export type ButtonLinkSize = 'sm' | 'md' | 'lg';

export type ButtonLinkProps = Omit<ComponentProps<typeof Link>, 'as' | 'style'> & {
  variant: ButtonLinkVariant;
  size?: ButtonLinkSize;
  style?: {
    '--button-link--bg'?: string;
    '--button-link--color'?: string;
    '--button-link--border-color'?: string;
    '--button-link--radius'?: string;
    '--button-link--font-size'?: string;
    '--button-link--font-weight'?: string;
  };
};

const Root = styled(Link, {
  base: {
    '--_radius': 'var(--button-link--radius, 0.375rem)',
    '--_hover-bg':
      'color-mix(in oklch, var(--_bg) 100%, var(--color-mix-target) var(--color-mix-ratio))',

    display: 'inline-flex',
    padding: 0,
    border: '1px solid var(--_border-color)',
    borderRadius: 'var(--_radius)',
    backgroundColor: 'var(--_bg)',
    color: 'var(--_color)',
    font: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'token(easings.outQuint)',
    '@media (any-hover: hover)': {
      '&:hover': {
        backgroundColor: 'var(--_hover-bg)',
      },
    },
    // The ring sits outside the link, so its color is measured against the
    // page background rather than against the link's own fill.
    '&:focus-visible': {
      outline: '2px solid {colors.text}',
      outlineOffset: '2px',
    },
  },
  variants: {
    variant: {
      solid: {
        '--_border-color':
          'var(--button-link--border-color, color-mix(in oklab, token(colors.muted) 20%, transparent))',
        '--_bg': 'var(--button-link--bg, token(colors.text))',
        '--_color': 'var(--button-link--color, token(colors.base))',
      },
      outline: {
        '--_border-color':
          'var(--button-link--border-color, color-mix(in oklab, token(colors.muted) 20%, transparent))',
        '--_bg': 'var(--button-link--bg, token(colors.surface))',
        '--_color': 'var(--button-link--color, token(colors.text))',
      },
      ghost: {
        '--_border-color': 'var(--button-link--border-color, transparent)',
        '--_bg': 'var(--button-link--bg, transparent)',
        '--_hover-bg': 'color-mix(in oklab, token(colors.muted) 10%, transparent)',
        '--_color': 'var(--button-link--color, token(colors.text))',
      },
    },
  },
});

const Layout = styled('span', {
  base: {
    '--_font-weight': 'var(--button-link--font-weight, bold)',

    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--_gap)',
    minHeight: 'var(--_min-height)',
    paddingInline: 'var(--_padding-inline)',
    paddingBlock: 'var(--_padding-block)',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
  },
  variants: {
    size: {
      sm: {
        '--_gap': 'token(spacing.1.5)',
        '--_min-height': 'token(sizes.8)',
        '--_padding-inline': 'token(spacing.3)',
        '--_padding-block': 'token(spacing.1.5)',
        '--_font-size': 'var(--button-link--font-size, token(fontSizes.sm))',
      },
      md: {
        '--_gap': 'token(spacing.2)',
        '--_min-height': 'token(sizes.10)',
        '--_padding-inline': 'token(spacing.4)',
        '--_padding-block': 'token(spacing.2)',
        '--_font-size': 'var(--button-link--font-size, token(fontSizes.md))',
      },
      lg: {
        '--_gap': 'token(spacing.2.5)',
        '--_min-height': 'token(sizes.12)',
        '--_padding-inline': 'token(spacing.5)',
        '--_padding-block': 'token(spacing.2.5)',
        '--_font-size': 'var(--button-link--font-size, token(fontSizes.lg))',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const ButtonLink: FC<ButtonLinkProps> = ({ variant, size, style, children, ...rest }) => {
  return (
    <Root style={style} variant={variant} {...rest}>
      <Layout size={size}>{children}</Layout>
    </Root>
  );
};
