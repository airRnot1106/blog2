export {};

if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}
