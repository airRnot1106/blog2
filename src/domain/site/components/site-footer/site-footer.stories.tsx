import { expect, within } from 'storybook/test';

import preview from '../../../../../.storybook/preview';
import { SiteFooter } from './site-footer';

const meta = preview.meta({
  component: SiteFooter,
  tags: ['autodocs'],
});

export const Default = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText('© 2025 - Copyright airRnot, All Rights Reserved.'),
    ).toBeVisible();
  },
});
