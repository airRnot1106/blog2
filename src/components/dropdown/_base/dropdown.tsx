'use client';

import { Menu } from '@base-ui/react/menu';
import { Check, ChevronDown } from 'lucide-react';
import type { ComponentProps, FC } from 'react';

import { styled } from '../../../../styled-system/jsx';

export type DropdownRootProps = ComponentProps<typeof Menu.Root>;

export type DropdownTriggerProps = Omit<ComponentProps<typeof Menu.Trigger>, 'style'> & {
  style?: {
    '--dropdown-trigger--bg'?: string;
    '--dropdown-trigger--color'?: string;
    '--dropdown-trigger--border-color'?: string;
    '--dropdown-trigger--radius'?: string;
    '--dropdown-trigger--font-size'?: string;
    '--dropdown-trigger--font-weight'?: string;
  };
};

export type DropdownContentProps = Omit<ComponentProps<typeof Menu.Popup>, 'style'> & {
  side?: ComponentProps<typeof Menu.Positioner>['side'];
  align?: ComponentProps<typeof Menu.Positioner>['align'];
  sideOffset?: ComponentProps<typeof Menu.Positioner>['sideOffset'];
  alignOffset?: ComponentProps<typeof Menu.Positioner>['alignOffset'];
  style?: {
    '--dropdown-content--bg'?: string;
    '--dropdown-content--border-color'?: string;
    '--dropdown-content--radius'?: string;
  };
};

export type DropdownItemStyle = {
  '--dropdown-item--color'?: string;
  '--dropdown-item--highlighted-bg'?: string;
  '--dropdown-item--font-size'?: string;
  '--dropdown-item--font-weight'?: string;
};

export type DropdownItemProps = Omit<ComponentProps<typeof Menu.Item>, 'style'> & {
  style?: DropdownItemStyle;
};

export type DropdownRadioGroupProps = ComponentProps<typeof Menu.RadioGroup>;

export type DropdownRadioItemProps = Omit<ComponentProps<typeof Menu.RadioItem>, 'style'> & {
  style?: DropdownItemStyle;
};

export type DropdownSeparatorProps = ComponentProps<typeof Menu.Separator>;
export type DropdownGroupProps = ComponentProps<typeof Menu.Group>;
export type DropdownGroupLabelProps = Omit<ComponentProps<typeof Menu.GroupLabel>, 'style'> & {
  style?: {
    '--dropdown-group-label--font-size'?: string;
    '--dropdown-group-label--font-weight'?: string;
  };
};

const TriggerRoot = styled(Menu.Trigger, {
  base: {
    '--_radius': 'var(--dropdown-trigger--radius, 0.375rem)',
    '--_hover-bg':
      'color-mix(in oklch, var(--_bg) 100%, var(--color-mix-target) var(--color-mix-ratio))',
    '--_border-color':
      'var(--dropdown-trigger--border-color, color-mix(in oklab, token(colors.muted) 20%, transparent))',
    '--_bg': 'var(--dropdown-trigger--bg, token(colors.surface))',
    '--_color': 'var(--dropdown-trigger--color, token(colors.text))',

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
    transitionTimingFunction: 'ease',
    '@media (any-hover: hover)': {
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--_hover-bg)',
      },
    },
    '&[data-popup-open]': {
      backgroundColor: 'var(--_hover-bg)',
    },
    // The ring sits outside the trigger, so its color is measured against the
    // page background rather than against the trigger's own fill.
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

const TriggerLayout = styled('span', {
  base: {
    '--_font-size': 'var(--dropdown-trigger--font-size, token(fontSizes.md))',
    '--_font-weight': 'var(--dropdown-trigger--font-weight, bold)',

    display: 'inline-flex',
    alignItems: 'center',
    gap: '2',
    minHeight: '10',
    paddingInline: '4',
    paddingBlock: '2',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
    '& > svg': {
      width: '4',
      height: '4',
      transitionProperty: 'transform',
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease',
    },
  },
});

const Positioner = styled(Menu.Positioner, {
  base: {
    zIndex: 50,
  },
});

const PopupRoot = styled(Menu.Popup, {
  base: {
    '--_radius': 'var(--dropdown-content--radius, 0.5rem)',
    '--_border-color':
      'var(--dropdown-content--border-color, color-mix(in oklab, token(colors.muted) 20%, transparent))',
    '--_bg': 'var(--dropdown-content--bg, token(colors.surface))',

    display: 'flex',
    flexDirection: 'column',
    minWidth: '48',
    gap: '0.5',
    padding: '1',
    border: '1px solid var(--_border-color)',
    borderRadius: 'var(--_radius)',
    backgroundColor: 'var(--_bg)',
    color: 'text',
    boxShadow: '0 4px 16px color-mix(in oklab, token(colors.text) 12%, transparent)',
    transformOrigin: 'var(--transform-origin)',
    transitionProperty: 'transform, opacity',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-out',
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      transform: 'scale(0.95)',
    },
    '&[data-instant]': {
      transitionDuration: '0s',
    },
  },
});

const itemBaseStyle = {
  '--_color': 'var(--dropdown-item--color, token(colors.text))',
  '--_highlighted-bg':
    'var(--dropdown-item--highlighted-bg, color-mix(in oklab, token(colors.muted) 10%, transparent))',
  '--_font-size': 'var(--dropdown-item--font-size, token(fontSizes.sm))',
  '--_font-weight': 'var(--dropdown-item--font-weight, normal)',

  display: 'flex',
  alignItems: 'center',
  gap: '2',
  padding: '2',
  borderRadius: '0.25rem',
  backgroundColor: 'transparent',
  color: 'var(--_color)',
  fontSize: 'var(--_font-size)',
  fontWeight: 'var(--_font-weight)',
  cursor: 'pointer',
  transitionProperty: 'background-color, color',
  transitionDuration: '100ms',
  transitionTimingFunction: 'ease',
  '&[data-highlighted]': {
    backgroundColor: 'var(--_highlighted-bg)',
  },
  '&[data-disabled]': {
    color: 'muted',
    cursor: 'not-allowed',
  },
};

const ItemRoot = styled(Menu.Item, {
  base: itemBaseStyle,
});

const RadioItemRoot = styled(Menu.RadioItem, {
  base: itemBaseStyle,
});

const RadioItemIndicatorRoot = styled(Menu.RadioItemIndicator, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginInlineStart: 'auto',
    '& > svg': {
      width: '4',
      height: '4',
    },
  },
});

export const Separator = styled(Menu.Separator, {
  base: {
    height: '1px',
    backgroundColor: 'color-mix(in oklab, token(colors.muted) 20%, transparent)',
  },
});

const GroupLabelRoot = styled(Menu.GroupLabel, {
  base: {
    '--_font-size': 'var(--dropdown-group-label--font-size, token(fontSizes.xs))',
    '--_font-weight': 'var(--dropdown-group-label--font-weight, bold)',

    padding: '2',
    color: 'muted',
    fontSize: 'var(--_font-size)',
    fontWeight: 'var(--_font-weight)',
  },
});

export const Root: FC<DropdownRootProps> = (props) => {
  return <Menu.Root {...props} />;
};

export const Group: FC<DropdownGroupProps> = (props) => {
  return <Menu.Group {...props} />;
};

export const Trigger: FC<DropdownTriggerProps> = ({ render, style, children, ...rest }) => {
  // `render` lets the caller substitute their own element (e.g. this
  // project's `Button`) as the trigger, so the default chrome is skipped
  // entirely rather than merged with it.
  if (render) {
    return <Menu.Trigger render={render} {...rest} />;
  }

  return (
    <TriggerRoot style={style} {...rest}>
      <TriggerLayout>
        {children}
        <ChevronDown aria-hidden="true" />
      </TriggerLayout>
    </TriggerRoot>
  );
};

export const Content: FC<DropdownContentProps> = ({
  side,
  align = 'start',
  sideOffset = 8,
  alignOffset,
  style,
  children,
  ...rest
}) => {
  return (
    <Menu.Portal>
      <Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset}>
        <PopupRoot style={style} {...rest}>
          {children}
        </PopupRoot>
      </Positioner>
    </Menu.Portal>
  );
};

export const Item: FC<DropdownItemProps> = ({ style, ...rest }) => {
  return <ItemRoot style={style} {...rest} />;
};

export const RadioGroup: FC<DropdownRadioGroupProps> = (props) => {
  return <Menu.RadioGroup {...props} />;
};

export const RadioItem: FC<DropdownRadioItemProps> = ({ style, children, ...rest }) => {
  return (
    <RadioItemRoot style={style} {...rest}>
      {children}
      <RadioItemIndicatorRoot>
        <Check aria-hidden="true" />
      </RadioItemIndicatorRoot>
    </RadioItemRoot>
  );
};

export const GroupLabel: FC<DropdownGroupLabelProps> = ({ style, ...rest }) => {
  return <GroupLabelRoot style={style} {...rest} />;
};

export const Dropdown = {
  Root,
  Trigger,
  Content,
  Item,
  RadioGroup,
  RadioItem,
  Separator,
  Group,
  GroupLabel,
};
