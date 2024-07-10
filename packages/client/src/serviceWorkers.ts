const s = self as unknown as ServiceWorkerGlobalScope;

export function listenForShare() {
  s.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // detect a share event from the PWA
    if (event.request.method === 'POST' && url.pathname === '/share') {
      // redirect so the user can refresh without resending data
      event.respondWith(Response.redirect('/'));

      // wait for ready message from main thread
      event.waitUntil(
        (async function () {
          await nextMessage('share-ready');

          if (!event.resultingClientId) return Response.redirect('/', 303);
          const client = await s.clients.get(event.resultingClientId);
          if (!client) {
            console.warn('No client found');
            return Response.redirect('/', 303);
          }

          const formData = await event.request.formData();
          const text = formData.get('text');
          const url = formData.get('url');
          const title = formData.get('title');
          client.postMessage({ type: 'pwa-share', text, url, title });
        })(),
      );
    }
  });
}

const nextMessageResolveMap = new Map<string, (() => void)[]>();

/**
 * Wait on a message with a particular event.data value.
 *
 * @param dataVal The event.data value.
 */
export function nextMessage(dataVal: string): Promise<void> {
  return new Promise((resolve) => {
    if (!nextMessageResolveMap.has(dataVal)) {
      nextMessageResolveMap.set(dataVal, []);
    }
    nextMessageResolveMap.get(dataVal)!.push(resolve);
  });
}

s.addEventListener('message', (event) => {
  const type = event.data && event.data.type;
  if (type) {
    const resolvers = nextMessageResolveMap.get(type);
    if (!resolvers) return;
    nextMessageResolveMap.delete(type);
    for (const resolve of resolvers) resolve();
  }
});
