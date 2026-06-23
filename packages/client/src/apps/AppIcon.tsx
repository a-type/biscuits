import { CSSProperties } from 'react';
import { useAppInfo } from '../react.js';

export interface AppIconProps {
	className?: string;
	style?: CSSProperties;
}

export function AppIcon({ style, ...rest }: AppIconProps) {
	const app = useAppInfo();

	return (
		<img
			src={app.iconPath}
			style={{
				width: 4 * 12,
				height: 4 * 12,
				...style,
			}}
			alt={app.name + ' icon'}
			{...rest}
		/>
	);
}
