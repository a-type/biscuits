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
				'mb-auto flex flex-col overflow-hidden border-default rounded-lg',
				className,
			)}
			{...rest}
		>
			<img
				src={`https://biscuits.club/images/gnocchi/${demo}.png`}
				className="h-auto w-full object-cover"
			/>
		</div>
	);
}
