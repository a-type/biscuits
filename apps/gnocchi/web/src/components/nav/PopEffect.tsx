import { useParticles } from '@a-type/ui';
import { debounce } from '@a-type/utils';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import cls from './PopEffect.module.css';

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
			className={classNames(cls.root, className)}
			data-active={animate}
			ref={ref}
		>
			<div className={cls.dot} data-active={animate} />
		</div>
	);
}
