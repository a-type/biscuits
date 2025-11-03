import { Button, clsx, Icon, IconName, ThemeName } from '@a-type/ui';

export interface TagToggleProps {
	name: string;
	icon?: IconName | null;
	color?: ThemeName | null;
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
}: TagToggleProps) {
	return (
		<Button
			size="small"
			emphasis="primary"
			className={clsx(
				'flex items-center gap-1 [font-weight:inherit] text-xs',
				color && `theme-${color}`,
				className,
			)}
			toggled={toggled}
			onClick={onToggle}
		>
			<span>
				<Icon name={icon || 'tag'} className="w-10px h-10px" />
			</span>
			<span>{name}</span>
		</Button>
	);
}
