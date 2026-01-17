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
				'min-h-24px flex items-center gap-1 rounded-full px-2 text-xs font-bold color-black border-gray-dark !bg-main-light',
				className,
			)}
		>
			<span>
				<Icon name={icon || 'tag'} className="h-10px w-10px" />
			</span>
			<span>{name}</span>
			{onRemove && (
				<Button emphasis="ghost" className="p-0" onClick={onRemove}>
					<Icon name="x" className="h-[10px] w-[10px]" />
				</Button>
			)}
		</Chip>
	);
}
