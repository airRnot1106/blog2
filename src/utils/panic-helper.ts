export const shouldNeverHappen = (msg?: string, ...args: unknown[]): never => {
  console.error(msg, ...args);
  if (process.env.NODE_ENV !== 'production') {
    // oxlint-disable-next-line no-debugger
    debugger;
  }

  throw new Error(`This should never happen: ${msg}`);
};
