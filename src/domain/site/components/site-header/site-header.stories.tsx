import type { FC, ReactNode } from 'react';
import { expect, waitFor, within } from 'storybook/test';

import preview from '../../../../../.storybook/preview';
import { styled } from '../../../../../styled-system/jsx';
import { SiteHeader } from './site-header';

const NarrowViewport: FC<{ children: ReactNode }> = ({ children }) => (
  <styled.div maxWidth="24rem">{children}</styled.div>
);

const meta = preview.meta({
  component: SiteHeader,
  tags: ['autodocs'],
});

export const Wide = meta.story({
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await waitFor(async () => expect(canvas.getByRole('link', { name: 'GitHub' })).toBeVisible(), {
      timeout: 10000,
    });
    await expect(canvas.getByRole('link', { name: 'RSSフィード' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'テーマを切り替える' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'メニューを開く' })).not.toBeInTheDocument();
  },
});

export const Narrow = meta.story({
  render: () => (
    <NarrowViewport>
      <SiteHeader />
    </NarrowViewport>
  ),
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await waitFor(
      async () => expect(canvas.getByRole('button', { name: 'メニューを開く' })).toBeVisible(),
      { timeout: 10000 },
    );
    await expect(canvas.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: 'RSSフィード' })).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole('button', { name: 'テーマを切り替える' }),
    ).not.toBeInTheDocument();
  },
});
