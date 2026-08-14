import { expect, within } from 'storybook/test';

import preview from '../../../../.storybook/preview';
import { token } from '../../../../styled-system/tokens';
import AboutMark from '../../../images/ich1q/about.svg';
import { Heading } from './heading';

const meta = preview.meta({
  component: Heading,
  tags: ['autodocs'],
  args: {
    level: 1,
    title: 'About',
  },
});

export const Default = meta.story({
  args: {
    level: 1,
    title: 'About',
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
  },
});

export const WithSubtitle = meta.story({
  args: {
    level: 1,
    title: 'About',
    subtitle: <AboutMark aria-hidden="true" />,
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
    await expect(canvasElement.querySelector('svg')).toBeInTheDocument();
  },
});

export const CustomStyle = meta.story({
  args: {
    level: 1,
    title: 'About',
    subtitle: <AboutMark aria-hidden="true" />,
    style: {
      '--heading--color': token.var('colors.love'),
      '--heading--font-size': token.var('fontSizes.6xl'),
      '--heading--font-weight': 'normal',
      '--heading--subtitle-color': token.var('colors.love'),
      '--heading--subtitle-font-size': token.var('fontSizes.lg'),
    },
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
    await expect(canvasElement.querySelector('svg')).toBeInTheDocument();
  },
});

const LEVELS = [1, 2, 3, 4, 5, 6] as const;

export const AllLevels = meta.story({
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {LEVELS.map((level) => (
        <Heading key={level} level={level} title={`Heading level ${level}`} />
      ))}
    </div>
  ),
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await Promise.all(
      LEVELS.map(async (level) => {
        await expect(
          canvas.getByRole('heading', { level, name: `Heading level ${level}` }),
        ).toBeInTheDocument();
      }),
    );
  },
});
