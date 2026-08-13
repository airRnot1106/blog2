import type { FC } from 'react';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import preview from '../../../../.storybook/preview';
import { token } from '../../../../styled-system/tokens';
import { Button } from '../../button/_base/button';
import { Dropdown } from './dropdown';

type DropdownDemoProps = {
  onEditClick?: () => void;
  onDuplicateClick?: () => void;
  onDeleteClick?: () => void;
  deleteDisabled?: boolean;
};

const DropdownDemo: FC<DropdownDemoProps> = ({
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
  deleteDisabled,
}) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>Options</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onClick={onEditClick}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={onDuplicateClick}>Duplicate</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item disabled={deleteDisabled} onClick={onDeleteClick}>
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

type RadioDropdownDemoProps = {
  onValueChange?: (value: string) => void;
};

const RadioDropdownDemo: FC<RadioDropdownDemoProps> = ({ onValueChange }) => {
  const [value, setValue] = useState('light');

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>Theme</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.RadioGroup
          value={value}
          onValueChange={(next: string) => {
            setValue(next);
            onValueChange?.(next);
          }}
        >
          <Dropdown.RadioItem value="light">Light</Dropdown.RadioItem>
          <Dropdown.RadioItem value="dark">Dark</Dropdown.RadioItem>
          <Dropdown.RadioItem value="system">System</Dropdown.RadioItem>
        </Dropdown.RadioGroup>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

const meta = preview.meta({
  component: DropdownDemo,
  tags: ['autodocs'],
  args: {
    onEditClick: fn(),
    onDuplicateClick: fn(),
    onDeleteClick: fn(),
  },
});

export const Default = meta.story({});

export const WithGroups = meta.story({
  render: () => (
    <Dropdown.Root>
      <Dropdown.Trigger>Account</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.GroupLabel>Profile</Dropdown.GroupLabel>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Billing</Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.GroupLabel>Session</Dropdown.GroupLabel>
          <Dropdown.Item>Log out</Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  ),
});

export const CustomTrigger = meta.story({
  render: () => (
    <Dropdown.Root>
      <Dropdown.Trigger render={<Button variant="outline">Actions</Button>} />
      <Dropdown.Content>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  ),
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Actions' });

    await userEvent.click(trigger);
    await screen.findByRole('menuitem', { name: 'Edit' });
  },
});

const onRadioValueChange = fn();

export const WithRadioItems = meta.story({
  render: () => <RadioDropdownDemo onValueChange={onRadioValueChange} />,
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Theme' });

    await userEvent.click(trigger);

    const lightItem = await screen.findByRole('menuitemradio', { name: 'Light' });
    const darkItem = await screen.findByRole('menuitemradio', { name: 'Dark' });

    await expect(lightItem).toHaveAttribute('aria-checked', 'true');
    await expect(darkItem).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(darkItem);

    await waitFor(async () => expect(darkItem).toHaveAttribute('aria-checked', 'true'));
    await waitFor(async () => expect(lightItem).toHaveAttribute('aria-checked', 'false'));
    await waitFor(async () => expect(onRadioValueChange).toHaveBeenCalledWith('dark'));
    // Radio items keep the menu open on selection, unlike plain items.
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
});

export const CustomTypography = meta.story({
  render: () => (
    <Dropdown.Root>
      <Dropdown.Trigger
        style={{
          '--dropdown-trigger--font-size': token.var('fontSizes.lg'),
          '--dropdown-trigger--font-weight': 'normal',
        }}
      >
        Options
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.GroupLabel
          style={{
            '--dropdown-group-label--font-size': token.var('fontSizes.sm'),
            '--dropdown-group-label--font-weight': 'normal',
          }}
        >
          Actions
        </Dropdown.GroupLabel>
        <Dropdown.Item
          style={{
            '--dropdown-item--font-size': token.var('fontSizes.lg'),
            '--dropdown-item--font-weight': 'bold',
          }}
        >
          Edit
        </Dropdown.Item>
        <Dropdown.Item>Duplicate</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  ),
});

export const OpenAndSelect = meta.story({
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Options' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await waitFor(async () => expect(trigger).toHaveAttribute('aria-expanded', 'true'));

    const item = await screen.findByRole('menuitem', { name: 'Edit' });
    await userEvent.click(item);

    await waitFor(async () => expect(args.onEditClick).toHaveBeenCalledOnce());
    await waitFor(async () => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(async () => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
});

export const DisabledItem = meta.story({
  args: {
    deleteDisabled: true,
  },
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Options' });

    await userEvent.click(trigger);

    const item = await screen.findByRole('menuitem', { name: 'Delete' });
    await expect(item).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(item);
    await expect(args.onDeleteClick).not.toHaveBeenCalled();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
});

export const KeyboardNavigation = meta.story({
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Options' });

    trigger.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(async () => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    const editItem = await screen.findByRole('menuitem', { name: 'Edit' });
    await waitFor(async () => expect(editItem).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}{Enter}');

    await waitFor(async () => expect(args.onDuplicateClick).toHaveBeenCalledOnce());
    await waitFor(async () => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(async () => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
});
