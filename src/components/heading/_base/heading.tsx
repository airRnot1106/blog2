import type { ComponentProps, FC, ReactNode } from 'react';

import { styled } from '../../../../styled-system/jsx';

export type HeadingProps = Omit<ComponentProps<'hgroup'>, 'style' | 'title'> & {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  title: ReactNode;
  subtitle?: ReactNode;
  style?: {
    '--heading--color'?: string;
    '--heading--font-size'?: string;
    '--heading--font-weight'?: string;
    '--heading--subtitle-color'?: string;
    '--heading--subtitle-font-size'?: string;
    '--heading--subtitle-font-weight'?: string;
    '--heading--underline-color'?: string;
  };
};

const HeadingGroup = styled('hgroup', {
  base: {
    '--_color': 'var(--heading--color, token(colors.text))',
    '--_font-weight': 'var(--heading--font-weight, bold)',
    '--_underline-color': 'var(--heading--underline-color, token(colors.iris))',

    display: 'inline-flex',
    alignItems: 'center',
    gap: '3',

    color: 'var(--_color)',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
    '& > h1, & > h2, & > h3, & > h4, & > h5, & > h6': {
      textDecoration: 'underline',
      textDecorationColor: 'var(--_underline-color)',
      textDecorationThickness: '2px',
      textUnderlineOffset: '8px',
    },
  },
  variants: {
    level: {
      h1: { '--_font-size': 'var(--heading--font-size, token(fontSizes.2xl))' },
      h2: { '--_font-size': 'var(--heading--font-size, token(fontSizes.xl))' },
      h3: { '--_font-size': 'var(--heading--font-size, token(fontSizes.lg))' },
      h4: { '--_font-size': 'var(--heading--font-size, token(fontSizes.md))' },
      h5: { '--_font-size': 'var(--heading--font-size, token(fontSizes.sm))' },
      h6: { '--_font-size': 'var(--heading--font-size, token(fontSizes.xs))' },
    },
  },
});

const Subtitle = styled('p', {
  base: {
    '--_color': 'var(--heading--subtitle-color, token(colors.text))',
    '--_font-size': 'var(--heading--subtitle-font-size, token(fontSizes.md))',
    '--_font-weight': 'var(--heading--subtitle-font-weight, bold)',

    display: 'inline-flex',
    alignItems: 'center',
    paddingInlineStart: '4',
    borderInlineStart: '1px solid color-mix(in oklab, token(colors.muted) 20%, transparent)',
    color: 'var(--_color)',
    fontSize: 'var(--_font-size)',
    '& svg, & img': {
      width: 'auto',
      height: '1em',
    },
  },
});

export const Heading: FC<HeadingProps> = ({ level, title, subtitle, ...rest }) => {
  const HeadingTag = `h${level}` as const;

  return (
    <HeadingGroup level={HeadingTag} {...rest}>
      <HeadingTag>{title}</HeadingTag>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </HeadingGroup>
  );
};
