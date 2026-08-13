import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import preview from '../../../../../.storybook/preview';
import { SiteThemeSwitchDropdown } from './site-theme-switch-dropdown';

const meta = preview.meta({
  component: SiteThemeSwitchDropdown,
  tags: ['autodocs'],
});

export const Default = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'テーマを切り替える' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await waitFor(async () => expect(trigger).toHaveAttribute('aria-expanded', 'true'));

    await screen.findByRole('menuitemradio', { name: 'Light' });
    await screen.findByRole('menuitemradio', { name: 'Dark' });
    await screen.findByRole('menuitemradio', { name: 'System' });
  },
});

export const SelectTheme = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'テーマを切り替える' });

    await userEvent.click(trigger);
    const lightItem = await screen.findByRole('menuitemradio', { name: 'Light' });
    await userEvent.click(lightItem);

    // Selecting a theme closes the menu.
    await waitFor(async () => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(async () => expect(screen.queryByRole('menu')).not.toBeInTheDocument());

    await userEvent.click(trigger);
    await waitFor(async () =>
      expect(await screen.findByRole('menuitemradio', { name: 'Light' })).toHaveAttribute(
        'aria-checked',
        'true',
      ),
    );
    await expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'false',
    );

    const darkItem = screen.getByRole('menuitemradio', { name: 'Dark' });
    await userEvent.click(darkItem);

    await waitFor(async () => expect(trigger).toHaveAttribute('aria-expanded', 'false'));

    await userEvent.click(trigger);
    await waitFor(async () =>
      expect(await screen.findByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute(
        'aria-checked',
        'true',
      ),
    );
    await expect(screen.getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  },
});
