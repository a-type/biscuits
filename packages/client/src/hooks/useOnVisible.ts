import { RefObject, useEffect } from 'react';

export function useOnVisible(
	ref: RefObject<HTMLElement | null>,
	callback: (isVisible: boolean) => void,
	options?: IntersectionObserverInit,
) {
	useEffect(() => {
		const el = ref.current;
		const observer = new IntersectionObserver(([entry]) => {
			callback(entry.isIntersecting);
		}, options);

		if (el) {
			observer.observe(el);
		}

		return () => {
			if (el) {
				observer.unobserve(el);
			}
		};
	}, [ref, callback, options]);
}
