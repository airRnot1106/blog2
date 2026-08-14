declare module '*.svg' {
  import type { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.svg?url' {
  // oxlint-disable-next-line typescript/no-explicit-any
  const content: any;
  export default content;
}
