import { RefObject, useEffect } from 'react';

// a shared global signal emitter makes things simple, just
// import it and call .emit('rerasterize') to trigger rerasterization of
// any relevant items when we need to.
export const rerasterizeSignal = new EventTarget();

// note on "defaultToOwnLayer" - if false, the item defaults to compositing with
// parent layer (will-change: initial). If true, it defaults to its own compositing
// layer (will-change: transform). The rerasterize just flips on and off.
export function useRerasterize(
	ref: RefObject<HTMLElement | SVGElement | null>,
	defaultToOwnLayer = true,
) {
	useEffect(() => {
		/**
		 * Dirty trick ahead - literally!
		 * This function forces an invalidation of the rasterized layer for
		 * this draggable (hence the 'dirty' joke, get it?). It does that by toggling
		 * off will-change: transform for one frame, then toggling it back on again. This
		 * effectively 'flattens' the layer which is created for this specific item back into
		 * the canvas (will-change: initial), then recreates the layer again (will-change: transform).
		 * Doing so re-rasterizes the layer at the current scale level, so that even 2x images and text
		 * are re-sharpened.
		 *
		 * We need this trick because just applying `will-change: transform` all the time doesn't seem
		 * to properly re-rasterize when the scale changes, leading to blurriness. By manually invalidating
		 * the layer (read: not just invalidating but trashing and re-creating - this could be less than
		 * desirable) we can choose to re-sharpen the contents after the user has changed the zoom of the
		 * viewport, which is the most logical and only necessary time to do it.
		 *
		 * TODO: if we need to optimize this even further, we could avoid re-rasterizing widgets which are
		 * currently offscreen!
		 */
		function rerasterize() {
			requestAnimationFrame(() => {
				if (!ref.current) return;
				const el = ref.current;
				el.style.willChange = defaultToOwnLayer ? 'initial' : 'transform';
				requestAnimationFrame(() => {
					el.style.willChange = defaultToOwnLayer ? 'transform' : 'initial';
				});
			});
		}
		rerasterizeSignal.addEventListener('rerasterize', rerasterize);
		return () => {
			rerasterizeSignal.removeEventListener('rerasterize', rerasterize);
		};
	}, [ref]);
}
