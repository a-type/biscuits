import { clsx } from '@a-type/ui';
import { useMemo } from 'react';
import classes from './PhoneDemo.module.css';

export interface PhoneDemoProps {
	src: string;
	direction?: 'left' | 'right';
	type?: 'video' | 'image';
	className?: string;
	size?: 'default' | 'large';
}

export function PhoneDemo({
	src,
	direction = 'left',
	type = 'video',
	className,
	size = 'default',
}: PhoneDemoProps) {
	const animationDelay = useMemo(() => {
		// eslint-disable-next-line react-hooks/purity
		return `${(Math.random() * 3).toFixed(2)}s`;
	}, []);

	const Media = type === 'video' ? Video : 'img';

	return (
		<div className={clsx(classes.wrapper, className)}>
			<div
				className={clsx(
					classes.phone,
					classes[direction],
					size === 'large' && classes.large,
				)}
				style={{
					animationDelay,
				}}
			>
				<div className={classes.placeholder}>Video Coming Soon</div>
				<Media src={src} className={classes.media} />
			</div>
		</div>
	);
}

function Video({ src, className }: { src: string; className: string }) {
	return (
		<video autoPlay loop muted playsInline src={src} className={className} />
	);
}

export default PhoneDemo;
