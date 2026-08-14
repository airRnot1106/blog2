'use client';

import { Button as BaseUIButton } from '@base-ui/react/button';
import type { ButtonProps as BaseUIButtonProps } from '@base-ui/react/button';
import { LoaderCircle } from 'lucide-react';
import type { FC } from 'react';
import { useTransition } from 'react';

import { styled } from '../../../../styled-system/jsx';

export type ButtonVariant = 'ghost' | 'outline' | 'solid';
export type ButtonSize = 'sm' | 'md' | 'lg';

type OnClick = NonNullable<BaseUIButtonProps['onClick']>;

export type ButtonProps = Omit<BaseUIButtonProps, 'style'> & {
  variant: ButtonVariant;
  size?: ButtonSize;
  style?: {
    '--button--bg'?: string;
    '--button--color'?: string;
    '--button--border-color'?: string;
    '--button--radius'?: string;
    '--button--font-size'?: string;
    '--button--font-weight'?: string;
  };
  action?: (...args: Parameters<OnClick>) => void | Promise<void>;
};

const Root = styled(BaseUIButton, {
  base: {
    '--_radius': 'var(--button--radius, 0.375rem)',
    '--_hover-bg':
      'color-mix(in oklch, var(--_bg) 100%, var(--color-mix-target) var(--color-mix-ratio))',

    display: 'inline-flex',
    padding: 0,
    border: '1px solid var(--_border-color)',
    borderRadius: 'var(--_radius)',
    backgroundColor: 'var(--_bg)',
    color: 'var(--_color)',
    font: 'inherit',
    cursor: 'pointer',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'token(easings.outQuint)',
    '@media (any-hover: hover)': {
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--_hover-bg)',
      },
    },
    // The ring sits outside the button, so its color is measured against the
    // page background rather than against the button's own fill.
    '&:focus-visible': {
      outline: '2px solid {colors.text}',
      outlineOffset: '2px',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },
  variants: {
    variant: {
      solid: {
        '--_border-color':
          'var(--button--border-color, color-mix(in oklab, token(colors.muted) 20%, transparent))',
        '--_bg': 'var(--button--bg, token(colors.text))',
        '--_color': 'var(--button--color, token(colors.base))',
      },
      outline: {
        '--_border-color':
          'var(--button--border-color, color-mix(in oklab, token(colors.muted) 20%, transparent))',
        '--_bg': 'var(--button--bg, token(colors.surface))',
        '--_color': 'var(--button--color, token(colors.text))',
      },
      ghost: {
        '--_border-color': 'var(--button--border-color, transparent)',
        '--_bg': 'var(--button--bg, transparent)',
        '--_hover-bg': 'color-mix(in oklab, token(colors.muted) 10%, transparent)',
        '--_color': 'var(--button--color, token(colors.text))',
      },
    },
  },
});

const Layout = styled('div', {
  base: {
    '--_font-weight': 'var(--button--font-weight, bold)',

    display: 'inline-grid',
    gridTemplateAreas: '"stack"',
    placeItems: 'center',
    minHeight: 'var(--_min-height)',
    paddingInline: 'var(--_padding-inline)',
    paddingBlock: 'var(--_padding-block)',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
  },
  variants: {
    size: {
      sm: {
        '--_min-height': 'token(sizes.8)',
        '--_padding-inline': 'token(spacing.3)',
        '--_padding-block': 'token(spacing.1.5)',
        '--_font-size': 'var(--button--font-size, token(fontSizes.sm))',
      },
      md: {
        '--_min-height': 'token(sizes.10)',
        '--_padding-inline': 'token(spacing.4)',
        '--_padding-block': 'token(spacing.2)',
        '--_font-size': 'var(--button--font-size, token(fontSizes.md))',
      },
      lg: {
        '--_min-height': 'token(sizes.12)',
        '--_padding-inline': 'token(spacing.5)',
        '--_padding-block': 'token(spacing.2.5)',
        '--_font-size': 'var(--button--font-size, token(fontSizes.lg))',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const Layer = styled('div', {
  base: {
    gridArea: 'stack',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--_gap)',
    // `opacity`, not `visibility`, so the button keeps its accessible name
    // while the content layer is visually replaced by the spinner.
    '&[data-hidden]': {
      opacity: 0,
    },
  },
  variants: {
    size: {
      sm: { '--_gap': 'token(spacing.1.5)' },
      md: { '--_gap': 'token(spacing.2)' },
      lg: { '--_gap': 'token(spacing.2.5)' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const Spinner = styled(LoaderCircle, {
  base: {
    animation: '--spin 0.6s linear infinite',
  },
  variants: {
    size: {
      sm: { width: '4', height: '4' },
      md: { width: '5', height: '5' },
      lg: { width: '6', height: '6' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  action,
  onClick,
  disabled = false,
  style,
  children,
  ...rest
}) => {
  const [isPending, startTransition] = useTransition();

  const handleClick: OnClick = (...args) => {
    onClick?.(...args);
    if (action) {
      startTransition(async () => {
        await action(...args);
      });
    }
  };

  return (
    <Root
      aria-busy={isPending || undefined}
      disabled={disabled || isPending}
      style={style}
      variant={variant}
      onClick={handleClick}
      {...rest}
    >
      <Layout size={size}>
        <Layer data-hidden={isPending || undefined} size={size}>
          {children}
        </Layer>
        {isPending && (
          <Layer aria-hidden="true" size={size}>
            <Spinner size={size} />
          </Layer>
        )}
      </Layout>
    </Root>
  );
};
