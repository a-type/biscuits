export async function registerBackgroundNotifications() {
  const status = await navigator.permissions.query({
    name: 'periodic-background-sync' as any,
  });
  if (status.state === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    if ('periodicSync' in registration) {
      try {
        await (registration.periodicSync as any).register('expiration-sync', {
          // An interval of one day.
          minInterval: 24 * 60 * 60 * 1000,
        });
      } catch (error) {
        // Periodic background sync cannot be used.
      }
    }
  } else {
    // Periodic background sync cannot be used.
  }
}
