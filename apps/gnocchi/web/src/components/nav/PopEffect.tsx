import { useParticles } from '@a-type/ui';
import { debounce } from '@a-type/utils';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface PopEffectProps {
	active?: boolean;
	className?: string;
}

export function PopEffect({ active, className }: PopEffectProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [animate, setAnimate] = useState(active);
	const cancelAnimation = useMemo(
		() => debounce(() => setAnimate(false), 1500),
		[setAnimate],
	);
	const particles = useParticles();

	useEffect(() => {
		if (active) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setAnimate(true);
			cancelAnimation();
			if (ref.current) {
				particles?.addParticles(
					particles.elementExplosion({
						element: ref.current,
						count: 20,
					}),
				);
			}
		}
	}, [active, cancelAnimation, particles]);

	return (
		<div
			className={classNames(
				'absolute center z--1 h-50px w-50px translate--50% scale-0 overflow-hidden rounded-full bg-primary',
				'[&[data-active=true]]:(animate-keyframes-pop animate-duration-1500 animate-ease-out animate-iteration-1)',
				className,
			)}
			data-active={animate}
			ref={ref}
		>
			<div
				className={classNames(
					'absolute center z-0 h-48px w-48px translate--50% scale-0 rounded-full bg-white',
					'[&[data-active=true]]:(animate-keyframes-pop animate-duration-1000 animate-ease-out animate-iteration-1 delay-500)',
				)}
				data-active={animate}
			/>
		</div>
	);
}
