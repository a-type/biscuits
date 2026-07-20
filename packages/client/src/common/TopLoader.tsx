import { clsx } from '@a-type/ui';
import { animated, useSpring } from '@react-spring/web';
import { useCallback, useEffect } from 'react';
import { useIsRouteTransitioning } from './routerCompat.js';
import cls from './TopLoader.module.css';

export interface TopLoaderProps {
	className?: string;
}

export function TopLoader({ className }: TopLoaderProps) {
	const show = useIsRouteTransitioning(500);

	const [style, spring] = useSpring(() => ({
		width: '0%',
	}));

	const run = useCallback(() => {
		let timeout: any | undefined;
		function step(previous: number) {
			spring.start({
				width: `${previous}%`,
			});
			const nextStep = Math.min(
				95 - previous,
				Math.min((95 - previous) / 2, Math.random() * 20),
			);
			timeout = setTimeout(
				step,
				500 + Math.random() * 1000,
				previous + nextStep,
			);
		}
		step(0);
		return () => {
			if (timeout) clearTimeout(timeout);
			spring.start({
				width: '100%',
			});
		};
	}, [spring]);

	useEffect(() => {
		if (show) {
			return run();
		}
	}, [show, run]);

	return (
		<div
			className={clsx(cls.root, className)}
			data-state={show ? 'visible' : 'hidden'}
		>
			<animated.div
				{...({
					className: cls.bar,
					style,
				} as any)}
			/>
		</div>
	);
}
