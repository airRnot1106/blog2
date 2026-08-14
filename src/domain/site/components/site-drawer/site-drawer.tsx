'use client';

import { SiGithub } from '@icons-pack/react-simple-icons';
import { Menu, Rss } from 'lucide-react';
import type { ComponentProps, FC } from 'react';

import { styled } from '../../../../../styled-system/jsx';
import { ButtonLink } from '../../../../components/button-link/_base/button-link';
import { Button } from '../../../../components/button/_base/button';
import { Drawer } from '../../../../components/drawer/_base/drawer';
import { SiteThemeSwitchDropdown } from '../../../../domain/site-theme/components/site-theme-switch-dropdown/site-theme-switch-dropdown';

export type SiteDrawerProps = Omit<ComponentProps<typeof Drawer.Root>, 'style'>;

const Layout = styled('div', {
  base: {
    display: 'grid',
    placeContent: 'center',
  },
});

const ActionArea = styled('div', {
  base: {
    display: 'flex',
    gap: '2',
  },
});

export const SiteDrawer: FC<SiteDrawerProps> = ({ ...rest }) => {
  return (
    <Drawer.Root {...rest}>
      <Drawer.Trigger
        aria-label="メニューを開く"
        render={
          <Button variant="ghost">
            <Menu size={24} />
          </Button>
        }
      />
      <Drawer.Content aria-label="サイトメニュー" side="right">
        <Layout>
          <ActionArea>
            <SiteThemeSwitchDropdown />
            <ButtonLink aria-label="GitHub" href="#" variant="ghost">
              <SiGithub />
            </ButtonLink>
            <ButtonLink aria-label="RSSフィード" href="#" variant="ghost">
              <Rss size={24} />
            </ButtonLink>
          </ActionArea>
        </Layout>
      </Drawer.Content>
    </Drawer.Root>
  );
};
