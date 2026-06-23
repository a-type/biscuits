import { Button, Chip, clsx, Icon, IconName } from '@a-type/ui';
import cls from './RemovableTag.module.css';

export interface RemovableTagProps {
	name: string;
	color?: string | null;
	icon?: IconName | null;
	onRemove?: () => void;
	className?: string;
}

export function RemovableTag({
	name,
	color,
	icon,
	onRemove,
	className,
}: RemovableTagProps) {
	return (
		<Chip
			color={color || 'primary'}
			className={clsx(`@mode-${color || 'primary'}`, cls.root, className)}
		>
			<span>
				<Icon name={icon || 'tag'} size={10} />
			</span>
			<span>{name}</span>
			{onRemove && (
				<Button emphasis="ghost" size="wrapper" onClick={onRemove}>
					<Icon name="x" size={10} />
				</Button>
			)}
		</Chip>
	);
}
