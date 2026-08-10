// oxlint-disable-next-line import/no-unassigned-import
import 'react';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}--${string}`]: string | number | undefined;
  }
}
