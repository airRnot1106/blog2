'use client';

import { SiGithub } from '@icons-pack/react-simple-icons';
import { useHydrated } from '@wrksz/themes/client';
import { Rss } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps, FC } from 'react';

import { styled } from '../../../../../styled-system/jsx';
import { ButtonLink } from '../../../../components/button-link/_base/button-link';
import { SiteThemeSwitchDropdown } from '../../../../domain/site-theme/components/site-theme-switch-dropdown/site-theme-switch-dropdown';
import { SiteDrawer } from '../site-drawer/site-drawer';

export type SiteHeaderProps = Omit<ComponentProps<'header'>, 'style'>;

// Establishes the query container consumed by `Nav` / `DrawerArea` below.
// Kept free of padding/border so it stays a pure size reference.
const Root = styled('header', {
  base: {
    container: '--site-header / inline-size',
    borderBottom: '1px solid color-mix(in oklab, token(colors.muted) 20%, transparent)',
    paddingInline: '4',
    paddingBlock: '2',
  },
});

const Layout = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4',
  },
});

const Logo = styled('h1', {
  base: {
    fontSize: '3xl',
    fontWeight: 'bold',
  },
});

const Nav = styled('nav', {
  base: {
    display: 'none',
    alignItems: 'center',
    gap: '6',
    '@container --site-header (inline-size >= calc(768 / 16 * 1rem))': {
      display: 'flex',
    },
  },
});

// TODO: 記事一覧実装後に反映させる
// const LinkArea = styled('div', {
//   base: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4',
//   },
// });

// `SiteThemeSwitchDropdown`'s icon only resolves after hydration, while the
// GitHub/RSS icons beside it are static and render on first paint. Fading
// the whole cluster in together — instead of letting the theme icon pop in
// alone a moment later — keeps the reveal timing consistent across the row.
const ActionArea = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    animationName: '--fade-in',
    animationDuration: '200ms',
    animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    animationFillMode: 'both',
    animationPlayState: 'paused',
    '&[data-revealed="true"]': {
      animationPlayState: 'initial',
    },
  },
});

const DrawerArea = styled('div', {
  base: {
    display: 'block',
    '@container --site-header (inline-size >= calc(768 / 16 * 1rem))': {
      display: 'none',
    },
  },
});

export const SiteHeader: FC<SiteHeaderProps> = ({ ...rest }) => {
  const hydrated = useHydrated();

  return (
    <Root {...rest}>
      <Layout>
        <Logo>
          <Link href="/">airRnot.dev</Link>
        </Logo>
        <Nav>
          {/* <LinkArea></LinkArea> */}
          <ActionArea data-revealed={hydrated}>
            <SiteThemeSwitchDropdown />
            <ButtonLink aria-label="GitHub" href="#" variant="ghost">
              <SiGithub />
            </ButtonLink>
            <ButtonLink aria-label="RSSフィード" href="#" variant="ghost">
              <Rss size={24} />
            </ButtonLink>
          </ActionArea>
        </Nav>
        <DrawerArea>
          <SiteDrawer />
        </DrawerArea>
      </Layout>
    </Root>
  );
};
