import classNames from 'classnames';
import { useMemo } from 'react';
import './phone.css';

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
		<div
			className={classNames(
				'phone-wrapper flex items-center justify-center overflow-hidden px-2 py-8',
				className,
			)}
		>
			<div
				className={classNames(
					'phone aspect-ratio-11/24 h-30vh min-h-0 rounded-lg bg-[black] sm:h-auto',
					size === 'large' && '!h-auto',
					direction,
				)}
				style={{
					animationDelay,
				}}
			>
				<div className="font-fancy absolute left-0 z--1 h-full w-full flex items-center justify-center p-6 text-center text-lg color-gray-dark">
					Video Coming Soon
				</div>
				<Media
					src={src}
					className="h-full w-full rounded-lg object-cover object-center"
				/>
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
