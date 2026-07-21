import { clsx } from '@a-type/ui';
import { animated, useSpring } from '@react-spring/web';
import { Router, useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import cls from './TopLoader.module.css';

export interface TopLoaderProps {
	className?: string;
	router: Router<any>;
}

export function TopLoader({ className, router }: TopLoaderProps) {
	const isTransitioning = useRouterState({
		router,
		select: (state) => state.isLoading,
	});

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

	const [show, setShow] = useState(false);

	useEffect(() => {
		if (!isTransitioning) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setShow(false);
			return;
		}
		const timeout = setTimeout(() => setShow(true), 500);
		return () => clearTimeout(timeout);
	}, [isTransitioning]);

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
