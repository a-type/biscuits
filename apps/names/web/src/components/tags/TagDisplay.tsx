import { hooks } from '@/hooks.js';
import { Chip, clsx, Icon, IconName, PaletteName } from '@a-type/ui';

export interface TagDisplayProps {
	name: string;
	className?: string;
}

export function TagDisplay({ name, className }: TagDisplayProps) {
	const tag = hooks.useTag(name);
	hooks.useWatch(tag);
	const color = tag?.get('color') as PaletteName | null;
	const icon = tag?.get('icon') as IconName | null;

	return (
		<Chip
			color="primary"
			className={clsx(color && `theme-${color}`, className)}
		>
			<Icon name={icon || 'tag'} className="h-10px w-10px" />
			<span>{name}</span>
		</Chip>
	);
}
