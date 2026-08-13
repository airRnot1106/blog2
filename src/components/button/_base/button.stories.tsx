import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import preview from '../../../../.storybook/preview';
import { Button } from './button';

const delay = async (ms: number) => {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
};

const meta = preview.meta({
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'solid',
  },
});

export const Solid = meta.story({
  args: {
    variant: 'solid',
  },
});

export const Outline = meta.story({
  args: {
    variant: 'outline',
  },
});

export const Ghost = meta.story({
  args: {
    variant: 'ghost',
  },
});

export const Small = meta.story({
  args: {
    variant: 'solid',
    size: 'sm',
  },
});

export const Medium = meta.story({
  args: {
    variant: 'solid',
    size: 'md',
  },
});

export const Large = meta.story({
  args: {
    variant: 'solid',
    size: 'lg',
  },
});

export const Disabled = meta.story({
  args: {
    variant: 'solid',
    disabled: true,
    onClick: fn(),
  },
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await expect(button).toBeDisabled();

    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
});

export const CustomRadius = meta.story({
  args: {
    variant: 'solid',
    style: {
      '--button--radius': '999px',
    },
  },
});

export const Pending = meta.story({
  args: {
    variant: 'solid',
    action: async () => delay(500),
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await waitFor(async () => expect(button).toHaveAttribute('aria-busy', 'true'));
    await waitFor(async () => expect(button).not.toHaveAttribute('aria-busy'));
  },
});

export const ActionRunsOnClick = meta.story({
  args: {
    variant: 'solid',
    action: fn(async () => delay(10)),
  },
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await waitFor(async () => expect(args.action).toHaveBeenCalledOnce());
  },
});
