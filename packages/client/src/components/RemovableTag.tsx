import { Button, Chip, clsx, Icon, IconName, ThemeName } from '@a-type/ui';

export interface RemovableTagProps {
	name: string;
	color?: ThemeName | null;
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
			color="primary"
			className={clsx(
				'flex items-center gap-1 px-2 rounded-full !bg-primary-light color-black border-gray-7 font-bold text-xs',
				color && `theme-${color}`,
				className,
			)}
		>
			<span>
				<Icon name={icon || 'tag'} className="w-10px h-10px" />
			</span>
			<span>{name}</span>
			{onRemove && (
				<Button size="icon" color="ghost" className="p-0" onClick={onRemove}>
					<Icon name="x" className="w-[10px] h-[10px]" />
				</Button>
			)}
		</Chip>
	);
}
