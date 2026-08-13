import NextLink from 'next/link';
import type { ComponentProps, FC } from 'react';

import { styled } from '../../../../styled-system/jsx';

export type LinkVariant = 'underline';
export type LinkProps = Omit<ComponentProps<typeof NextLink>, 'as' | 'style'> & {
  variant: LinkVariant;
  style?: {
    '--link--color'?: string;
    '--link--font-size'?: string;
    '--link--font-weight'?: string;
  };
};

const Root = styled(NextLink, {
  base: {
    '--_color': 'var(--link--color, inherit)',
    '--_font-size': 'var(--link--font-size, inherit)',
    '--_font-weight': 'var(--link--font-weight, inherit)',

    color: 'var(--_color)',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
  },
  variants: {
    variant: {
      underline: {
        textDecoration: 'underline',
        textDecorationColor: 'currentColor',
        textDecorationThickness: '0.1em',
        textUnderlineOffset: '0.2em',
        '@media (any-hover: hover)': {
          '&:hover': {
            textUnderlineOffset: '0.3em',
          },
        },
      },
    },
  },
});

export const Link: FC<LinkProps> = ({ children, ...rest }) => {
  return <Root {...rest}>{children}</Root>;
};
