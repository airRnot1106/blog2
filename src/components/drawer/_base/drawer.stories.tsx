import type { FC } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import preview from '../../../../.storybook/preview';
import { token } from '../../../../styled-system/tokens';
import type { DrawerSide } from './drawer';
import { Drawer } from './drawer';

type DrawerDemoProps = {
  side?: DrawerSide;
  onOpenChange?: (open: boolean) => void;
};

const DrawerDemo: FC<DrawerDemoProps> = ({ side = 'bottom', onOpenChange }) => {
  return (
    <Drawer.Root onOpenChange={onOpenChange}>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Content side={side}>
        <Drawer.Title>Notifications</Drawer.Title>
        <Drawer.Description>You are all caught up. Good job!</Drawer.Description>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Content>
    </Drawer.Root>
  );
};

const meta = preview.meta({
  component: DrawerDemo,
  tags: ['autodocs'],
  args: {
    onOpenChange: fn(),
  },
});

export const Top = meta.story({
  args: {
    side: 'top',
  },
});

export const Right = meta.story({
  args: {
    side: 'right',
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open drawer' });

    await userEvent.click(trigger);
    await screen.findByRole('dialog');
  },
});

export const CustomStyling = meta.story({
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Content
        side="right"
        style={{
          '--drawer-content--bg': token.var('colors.overlay'),
          '--drawer-content--width': token.var('sizes.sm'),
        }}
      >
        <Drawer.Title style={{ '--drawer-title--font-size': token.var('fontSizes.xl') }}>
          Custom drawer
        </Drawer.Title>
        <Drawer.Description>Styled entirely via public custom properties.</Drawer.Description>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Content>
    </Drawer.Root>
  ),
});

export const OpenAndClose = meta.story({
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open drawer' });

    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog');
    await expect(dialog).toHaveAccessibleName('Notifications');
    await waitFor(async () =>
      expect(args.onOpenChange).toHaveBeenCalledWith(true, expect.anything()),
    );

    const closeButton = await screen.findByRole('button', { name: 'Close' });
    await userEvent.click(closeButton);

    await waitFor(async () =>
      expect(args.onOpenChange).toHaveBeenCalledWith(false, expect.anything()),
    );
    await waitFor(async () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(async () => expect(trigger).toHaveFocus());
  },
});

export const EscapeKeyCloses = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open drawer' });

    await userEvent.click(trigger);
    await screen.findByRole('dialog');

    await userEvent.keyboard('{Escape}');

    await waitFor(async () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(async () => expect(trigger).toHaveFocus());
  },
});
