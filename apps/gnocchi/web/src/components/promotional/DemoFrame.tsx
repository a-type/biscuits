import classNames from 'classnames';
import { CSSProperties } from 'react';

export interface DemoFrameProps {
	demo: string;
	style?: CSSProperties;
	className?: string;
}

export function DemoFrame({ demo, className, ...rest }: DemoFrameProps) {
	return (
		<div
			className={classNames(
				'flex flex-col border-default rounded-lg overflow-hidden mb-auto',
				className,
			)}
			{...rest}
		>
			<img
				src={`https://biscuits.club/images/gnocchi/${demo}.png`}
				className="w-full h-auto object-cover"
			/>
		</div>
	);
}
