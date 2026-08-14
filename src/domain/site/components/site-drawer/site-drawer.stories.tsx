import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import preview from '../../../../../.storybook/preview';
import { SiteDrawer } from './site-drawer';

const meta = preview.meta({
  component: SiteDrawer,
  tags: ['autodocs'],
});

export const Default = meta.story({});

export const OpenMenu = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'メニューを開く' });

    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog');
    await expect(within(dialog).getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(within(dialog).getByRole('link', { name: 'RSSフィード' })).toBeVisible();
    await expect(within(dialog).getByRole('button', { name: 'テーマを切り替える' })).toBeVisible();
  },
});

export const CloseMenuWithEscape = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'メニューを開く' });

    await userEvent.click(trigger);
    await screen.findByRole('dialog');

    await userEvent.keyboard('{Escape}');

    await waitFor(async () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(async () => expect(trigger).toHaveFocus());
  },
});
