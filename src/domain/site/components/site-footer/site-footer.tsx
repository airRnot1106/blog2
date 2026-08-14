import type { ComponentProps, FC } from 'react';

import { styled } from '../../../../../styled-system/jsx';

export type SiteFooterProps = Omit<ComponentProps<'footer'>, 'style'>;

const Root = styled('footer', {
  base: {
    borderTop: '1px solid color-mix(in oklab, token(colors.muted) 20%, transparent)',
    paddingInline: '2',
    paddingBlock: '1',
  },
});

const Layout = styled('div', {
  base: {
    display: 'grid',
    placeContent: 'center',
  },
});

const Copyright = styled('p', {
  base: {
    fontSize: 'xs',
    fontWeight: '300',
  },
});

export const SiteFooter: FC<SiteFooterProps> = ({ ...rest }) => {
  return (
    <Root {...rest}>
      <Layout>
        <Copyright>© 2025 - Copyright airRnot, All Rights Reserved.</Copyright>
      </Layout>
    </Root>
  );
};
