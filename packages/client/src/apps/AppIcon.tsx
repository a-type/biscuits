import { CSSProperties } from 'react';
import { useAppInfo } from '../react.js';

export interface AppIconProps {
	className?: string;
	style?: CSSProperties;
	size?: number;
}

export function AppIcon({ style, size, ...rest }: AppIconProps) {
	const app = useAppInfo();

	return (
		<img
			src={app.iconPath}
			style={{
				width: size ?? 4 * 12,
				height: size ?? 4 * 12,
				...style,
			}}
			alt={app.name + ' icon'}
			{...rest}
		/>
	);
}
