import { proxy } from 'valtio';
import { registerSW } from 'virtual:pwa-register';

export const updateState = proxy({
  updateAvailable: false,
});

let check: (() => void) | undefined = undefined;

const update = registerSW({
  onNeedRefresh() {
    updateState.updateAvailable = true;
    console.log('Update available and ready to install');
  },
  onRegisteredSW(swUrl, registration) {
    console.log('Service worker registered', swUrl);
    if (registration) {
      setInterval(
        () => {
          registration.update();
          check = registration.update;
          // hourly
        },
        60 * 60 * 1000,
      );
    }
  },
  onRegisterError(error) {
    console.error('Service worker registration error', error);
  },
});

export async function updateApp(reload?: boolean) {
  let timeout = setTimeout(() => {
    window.location.reload();
  }, 5000);
  await update(!!reload);
  clearTimeout(timeout);
}

export function checkForUpdate() {
  check?.();
}
