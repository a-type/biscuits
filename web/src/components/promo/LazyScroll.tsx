import { Box, clsx } from '@a-type/ui';
import { ReactNode, useEffect, useRef } from 'react';

export interface LazyScrollProps {
	children: ReactNode;
	className?: string;
}

export function LazyScroll({ className, children }: LazyScrollProps) {
	const outerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const outer = outerRef.current;
		if (!outer) return;
		const inner = outer.children[0] as HTMLElement;
		let forward = true;
		inner.style.setProperty('transition', 'transform 8s linear 2s');
		const int = setInterval(() => {
			const difference = outer.scrollWidth - outer.clientWidth;

			if (forward) {
				inner.style.setProperty('transform', `translateX(-${difference}px)`);
			} else {
				inner.style.setProperty('transform', 'translateX(0)');
			}
			forward = !forward;
		}, 10 * 1000);
		return () => {
			clearInterval(int);
		};
	}, []);

	return (
		<Box
			ref={outerRef}
			className={clsx('h-[120px] w-full overflow-hidden', className)}
		>
			<Box gap>{children}</Box>
		</Box>
	);
}
