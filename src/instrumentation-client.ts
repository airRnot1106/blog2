if (process.env['NEXT_PUBLIC_API_MOCKING'] === 'enabled') {
  void import('./mocks/browser').then(async ({ worker }) =>
    worker.start({ onUnhandledRequest: 'bypass' }),
  );
}
