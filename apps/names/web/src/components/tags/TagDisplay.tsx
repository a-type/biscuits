import { hooks } from '@/hooks.js';
import { Chip, clsx, Icon, IconName, ThemeName } from '@a-type/ui';

export interface TagDisplayProps {
	name: string;
	className?: string;
}

export function TagDisplay({ name, className }: TagDisplayProps) {
	const tag = hooks.useTag(name);
	hooks.useWatch(tag);
	const color = tag?.get('color') as ThemeName | null;
	const icon = tag?.get('icon') as IconName | null;

	return (
		<Chip
			color="primary"
			className={clsx(color && `theme-${color}`, className)}
		>
			<Icon name={icon || 'tag'} className="w-10px h-10px" />
			<span>{name}</span>
		</Chip>
	);
}
