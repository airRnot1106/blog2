import { ThemeProvider } from '@wrksz/themes/next';
import type { Metadata } from 'next';

import { styled } from '../../styled-system/jsx';
import { SiteFooter } from '../domain/site/components/site-footer/site-footer';
import { SiteHeader } from '../domain/site/components/site-header/site-header';

import './globals.css';

export const metadata: Metadata = {
  title: 'airRnot.dev',
  description: "airRnot's blog",
};

const Body = styled('body', {
  base: {
    position: 'relative',
  },
});

const Root = styled('div', {
  base: {
    isolation: 'isolate',
  },
});

const Layout = styled('div', {
  base: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    minHeight: '100dvh',
  },
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <Body>
        <ThemeProvider attribute="data-theme">
          <Root>
            <Layout>
              <SiteHeader />
              <div>{children}</div>
              <SiteFooter />
            </Layout>
          </Root>
        </ThemeProvider>
      </Body>
    </html>
  );
}
