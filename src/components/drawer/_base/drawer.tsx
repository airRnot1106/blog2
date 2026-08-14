'use client';

import { Drawer as BaseUIDrawer } from '@base-ui/react/drawer';
import type { ComponentProps, FC } from 'react';

import { styled } from '../../../../styled-system/jsx';

export type DrawerSide = 'top' | 'bottom' | 'left' | 'right';

export type DrawerRootProps = ComponentProps<typeof BaseUIDrawer.Root>;

export type DrawerTriggerProps = Omit<ComponentProps<typeof BaseUIDrawer.Trigger>, 'style'> & {
  style?: {
    '--drawer-trigger--bg'?: string;
    '--drawer-trigger--color'?: string;
    '--drawer-trigger--border-color'?: string;
    '--drawer-trigger--radius'?: string;
    '--drawer-trigger--font-size'?: string;
    '--drawer-trigger--font-weight'?: string;
  };
};

export type DrawerContentProps = Omit<ComponentProps<typeof BaseUIDrawer.Popup>, 'style'> & {
  side?: DrawerSide;
  style?: {
    '--drawer-backdrop--bg'?: string;
    '--drawer-content--bg'?: string;
    '--drawer-content--border-color'?: string;
    '--drawer-content--radius'?: string;
    '--drawer-content--width'?: string;
    '--drawer-content--height'?: string;
  };
};

export type DrawerTitleProps = Omit<ComponentProps<typeof BaseUIDrawer.Title>, 'style'> & {
  style?: {
    '--drawer-title--color'?: string;
    '--drawer-title--font-size'?: string;
    '--drawer-title--font-weight'?: string;
  };
};

export type DrawerDescriptionProps = Omit<
  ComponentProps<typeof BaseUIDrawer.Description>,
  'style'
> & {
  style?: {
    '--drawer-description--color'?: string;
    '--drawer-description--font-size'?: string;
  };
};

export type DrawerCloseProps = Omit<ComponentProps<typeof BaseUIDrawer.Close>, 'style'> & {
  style?: {
    '--drawer-close--bg'?: string;
    '--drawer-close--color'?: string;
    '--drawer-close--border-color'?: string;
    '--drawer-close--radius'?: string;
    '--drawer-close--font-size'?: string;
    '--drawer-close--font-weight'?: string;
  };
};

const TriggerRoot = styled(BaseUIDrawer.Trigger, {
  base: {
    '--_radius': 'var(--drawer-trigger--radius, 0.375rem)',
    '--_hover-bg':
      'color-mix(in oklch, var(--_bg) 100%, var(--color-mix-target) var(--color-mix-ratio))',
    '--_border-color':
      'var(--drawer-trigger--border-color, color-mix(in oklab, token(colors.muted) 20%, transparent))',
    '--_bg': 'var(--drawer-trigger--bg, token(colors.surface))',
    '--_color': 'var(--drawer-trigger--color, token(colors.text))',
    '--_font-size': 'var(--drawer-trigger--font-size, token(fontSizes.md))',
    '--_font-weight': 'var(--drawer-trigger--font-weight, bold)',

    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '10',
    paddingInline: '4',
    paddingBlock: '2',
    border: '1px solid var(--_border-color)',
    borderRadius: 'var(--_radius)',
    backgroundColor: 'var(--_bg)',
    color: 'var(--_color)',
    font: 'inherit',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
    cursor: 'pointer',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'token(easings.outQuint)',
    '@media (any-hover: hover)': {
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--_hover-bg)',
      },
    },
    '&:focus-visible': {
      outline: '2px solid {colors.text}',
      outlineOffset: '2px',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },
});

const BackdropRoot = styled(BaseUIDrawer.Backdrop, {
  base: {
    '--_bg': 'var(--drawer-backdrop--bg, color-mix(in oklab, token(colors.text) 40%, transparent))',

    position: 'fixed',
    inset: '0',
    zIndex: 40,
    backgroundColor: 'var(--_bg)',
    transitionProperty: 'opacity',
    transitionDuration: '250ms',
    transitionTimingFunction: 'token(easings.outQuint)',
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
    },
    '&[data-swiping]': {
      transitionDuration: '0s',
    },
  },
});

const ViewportRoot = styled(BaseUIDrawer.Viewport, {
  base: {
    position: 'fixed',
    inset: '0',
    zIndex: 50,
    display: 'flex',
  },
  variants: {
    side: {
      top: { alignItems: 'flex-start', justifyContent: 'center' },
      bottom: { alignItems: 'flex-end', justifyContent: 'center' },
      left: { alignItems: 'stretch', justifyContent: 'flex-start' },
      right: { alignItems: 'stretch', justifyContent: 'flex-end' },
    },
  },
  defaultVariants: {
    side: 'bottom',
  },
});

const PopupRoot = styled(BaseUIDrawer.Popup, {
  base: {
    '--_radius': 'var(--drawer-content--radius, 0px)',
    '--_bg': 'var(--drawer-content--bg, token(colors.surface))',
    '--_border-color':
      'var(--drawer-content--border-color, color-mix(in oklab, token(colors.muted) 20%, transparent))',

    display: 'flex',
    flexDirection: 'column',
    padding: '6',
    borderRadius: 'var(--_radius)',
    backgroundColor: 'var(--_bg)',
    color: 'text',
    outline: 'none',
    boxShadow: '0 4px 16px color-mix(in oklab, token(colors.text) 12%, transparent)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    transitionProperty: 'transform',
    transitionDuration: '350ms',
    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
    '&[data-swiping]': {
      transitionDuration: '0s',
    },
    // The slide covers a large share of the viewport, so under reduced
    // motion it's replaced with a plain opacity crossfade instead of being
    // shortened — the swipe gesture itself is untouched, since it tracks
    // the pointer 1:1 rather than autoplaying.
    '@media (prefers-reduced-motion: reduce)': {
      transitionProperty: 'opacity',
      transitionDuration: '150ms',
      transitionTimingFunction: 'token(easings.outQuint)',
      '&[data-starting-style], &[data-ending-style]': {
        opacity: 0,
      },
    },
  },
  variants: {
    side: {
      top: {
        '--_max-height': 'var(--drawer-content--height, 80vh)',

        width: '100%',
        maxHeight: 'var(--_max-height)',
        borderBottom: '1px solid var(--_border-color)',
        transform: 'translateY(var(--drawer-swipe-movement-y, 0px))',
        '&[data-starting-style], &[data-ending-style]': {
          transform: 'translateY(-100%)',
        },
      },
      bottom: {
        '--_max-height': 'var(--drawer-content--height, 80vh)',

        width: '100%',
        maxHeight: 'var(--_max-height)',
        borderTop: '1px solid var(--_border-color)',
        transform: 'translateY(var(--drawer-swipe-movement-y, 0px))',
        '&[data-starting-style], &[data-ending-style]': {
          transform: 'translateY(100%)',
        },
      },
      left: {
        '--_width': 'var(--drawer-content--width, token(sizes.xs))',

        height: '100%',
        width: 'var(--_width)',
        borderInlineEnd: '1px solid var(--_border-color)',
        transform: 'translateX(var(--drawer-swipe-movement-x, 0px))',
        '&[data-starting-style], &[data-ending-style]': {
          transform: 'translateX(-100%)',
        },
      },
      right: {
        '--_width': 'var(--drawer-content--width, token(sizes.xs))',

        height: '100%',
        width: 'var(--_width)',
        borderInlineStart: '1px solid var(--_border-color)',
        transform: 'translateX(var(--drawer-swipe-movement-x, 0px))',
        '&[data-starting-style], &[data-ending-style]': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  defaultVariants: {
    side: 'bottom',
  },
});

const ContentLayout = styled(BaseUIDrawer.Content, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2',
  },
});

const TitleRoot = styled(BaseUIDrawer.Title, {
  base: {
    '--_color': 'var(--drawer-title--color, token(colors.text))',
    '--_font-size': 'var(--drawer-title--font-size, token(fontSizes.lg))',
    '--_font-weight': 'var(--drawer-title--font-weight, bold)',

    color: 'var(--_color)',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
  },
});

const DescriptionRoot = styled(BaseUIDrawer.Description, {
  base: {
    // `colors.muted` reads at ~2.8:1 against `colors.surface` in both
    // themes — well under the 4.5:1 AA floor for this text size — so
    // de-emphasis comes from weight instead of a low-contrast color.
    '--_color': 'var(--drawer-description--color, token(colors.text))',
    '--_font-size': 'var(--drawer-description--font-size, token(fontSizes.sm))',

    color: 'var(--_color)',
    fontSize: 'var(--_font-size)',
    fontWeight: '300',
  },
});

const CloseRoot = styled(BaseUIDrawer.Close, {
  base: {
    '--_radius': 'var(--drawer-close--radius, 0.375rem)',
    '--_hover-bg': 'color-mix(in oklab, token(colors.muted) 10%, transparent)',
    '--_border-color': 'var(--drawer-close--border-color, transparent)',
    '--_bg': 'var(--drawer-close--bg, transparent)',
    '--_color': 'var(--drawer-close--color, token(colors.text))',
    '--_font-size': 'var(--drawer-close--font-size, token(fontSizes.sm))',
    '--_font-weight': 'var(--drawer-close--font-weight, bold)',

    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '8',
    paddingInline: '3',
    paddingBlock: '1.5',
    border: '1px solid var(--_border-color)',
    borderRadius: 'var(--_radius)',
    backgroundColor: 'var(--_bg)',
    color: 'var(--_color)',
    font: 'inherit',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
    cursor: 'pointer',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'token(easings.outQuint)',
    '@media (any-hover: hover)': {
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--_hover-bg)',
      },
    },
    '&:focus-visible': {
      outline: '2px solid {colors.text}',
      outlineOffset: '2px',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },
});

export const Root: FC<DrawerRootProps> = (props) => {
  return <BaseUIDrawer.Root {...props} />;
};

export const Trigger: FC<DrawerTriggerProps> = ({ render, style, ...rest }) => {
  // `render` lets the caller substitute their own element (e.g. this
  // project's `Button`) as the trigger, so the default chrome is skipped
  // entirely rather than merged with it.
  if (render) {
    return <BaseUIDrawer.Trigger render={render} {...rest} />;
  }

  return <TriggerRoot style={style} {...rest} />;
};

export const Content: FC<DrawerContentProps> = ({ side = 'bottom', style, children, ...rest }) => {
  return (
    // `style` is applied on the portal so its custom properties cascade to
    // both the backdrop and the popup, which are siblings rather than
    // ancestor/descendant of each other.
    <BaseUIDrawer.Portal style={style}>
      <BackdropRoot />
      <ViewportRoot side={side}>
        <PopupRoot side={side} {...rest}>
          <ContentLayout>{children}</ContentLayout>
        </PopupRoot>
      </ViewportRoot>
    </BaseUIDrawer.Portal>
  );
};

export const Title: FC<DrawerTitleProps> = ({ style, ...rest }) => {
  return <TitleRoot style={style} {...rest} />;
};

export const Description: FC<DrawerDescriptionProps> = ({ style, ...rest }) => {
  return <DescriptionRoot style={style} {...rest} />;
};

export const Close: FC<DrawerCloseProps> = ({ style, ...rest }) => {
  return <CloseRoot style={style} {...rest} />;
};

export const Drawer = {
  Root,
  Trigger,
  Content,
  Title,
  Description,
  Close,
};
