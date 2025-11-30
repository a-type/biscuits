import { Button, clsx, Icon, IconName, PaletteName } from '@a-type/ui';

export interface TagToggleProps {
	name: string;
	icon?: IconName | null;
	color?: PaletteName | null;
	className?: string;
	onToggle?: () => void;
	toggled?: boolean;
}

export function TagToggle({
	name,
	icon,
	color,
	className,
	onToggle,
	toggled,
	...rest
}: TagToggleProps) {
	return (
		<Button
			size="small"
			emphasis="light"
			className={clsx(
				'flex items-center gap-1 [font-weight:inherit] text-xs',
				className,
			)}
			toggled={toggled}
			onClick={onToggle}
			color={color ?? undefined}
			{...rest}
		>
			<span>
				<Icon name={icon || 'tag'} className="w-10px h-10px" />
			</span>
			<span>{name}</span>
		</Button>
	);
}
