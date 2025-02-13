import { RefObject, useEffect } from 'react';

export function useOnVisible(
	ref: RefObject<HTMLElement | null>,
	callback: (isVisible: boolean) => void,
	options?: IntersectionObserverInit,
) {
	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			callback(entry.isIntersecting);
		}, options);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [ref, callback, options]);
}
