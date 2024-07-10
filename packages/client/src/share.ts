export interface ShareData {
  url?: string;
  text?: string;
  title?: string;
}

export function onShare(callback: (share: ShareData) => void) {
  if (typeof window === 'undefined') return;
  if (typeof navigator === 'undefined') return;
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.addEventListener('message', async (event) => {
    if (event.data.type === 'pwa-share') {
      const text = event.data.text as string | undefined;
      let url = event.data.url as string | undefined;
      const title = event.data.title as string | undefined;

      if (text || url || title) {
        if (!url && text && isUrl(text)) {
          url = text;
        }
        callback({ url, text, title });
      } else {
        console.debug('Got unrecognized PWA share:', event.data);
      }
    }
  });
  navigator.serviceWorker.controller?.postMessage({ type: 'share-ready' });
}

function isUrl(text: string) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}
