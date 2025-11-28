import { Button, Chip, clsx, Icon, IconName, PaletteName } from '@a-type/ui';

export interface RemovableTagProps {
	name: string;
	color?: PaletteName | null;
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
			className={clsx(
				'flex items-center gap-1 px-2 rounded-full !bg-main-light color-black border-gray-dark font-bold text-xs min-h-touch',
				className,
			)}
		>
			<span>
				<Icon name={icon || 'tag'} className="w-10px h-10px" />
			</span>
			<span>{name}</span>
			{onRemove && (
				<Button emphasis="ghost" className="p-0" onClick={onRemove}>
					<Icon name="x" className="w-[10px] h-[10px]" />
				</Button>
			)}
		</Chip>
	);
}
