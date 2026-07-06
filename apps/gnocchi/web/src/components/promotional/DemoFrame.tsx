import { Box } from '@a-type/ui';
import { CSSProperties } from 'react';

export interface DemoFrameProps {
	demo: string;
	style?: CSSProperties;
	className?: string;
}

export function DemoFrame({ demo, className, ...rest }: DemoFrameProps) {
	return (
		<Box
			col
			overflow="hidden"
			border
			rounded
			style={{ marginBottom: 'auto' }}
			className={className}
			{...rest}
		>
			<img
				src={`https://biscuits.club/images/gnocchi/${demo}.png`}
				style={{
					height: 'auto',
					width: '100%',
					objectFit: 'cover',
				}}
			/>
		</Box>
	);
}
