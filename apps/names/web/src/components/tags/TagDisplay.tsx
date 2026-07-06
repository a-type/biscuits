import { hooks } from '@/hooks.js';
import { Chip, clsx, Icon, IconName } from '@a-type/ui';

export interface TagDisplayProps {
	name: string;
	className?: string;
}

export function TagDisplay({ name, className }: TagDisplayProps) {
	const tag = hooks.useTag(name);
	hooks.useWatch(tag);
	const color = tag?.get('color') as string | null;
	const icon = tag?.get('icon') as IconName | null;

	return (
		<Chip
			color="primary"
			className={clsx(color && `@mode-${color}`, className)}
		>
			<Icon name={icon || 'tag'} size={10} />
			<span>{name}</span>
		</Chip>
	);
}
