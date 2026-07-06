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
			<Icon name={icon || 'tag'} />
			<span>{name}</span>
			{onRemove && (
				<Button
					emphasis="ghost"
					size="wrapper"
					className="@mode-dense"
					onClick={onRemove}
				>
					<Icon name="x" />
				</Button>
			)}
		</Chip>
	);
}
