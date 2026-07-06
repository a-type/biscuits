import { Button, clsx, Icon, IconName } from '@a-type/ui';

export interface TagToggleProps {
	name: string;
	icon?: IconName | null;
	color?: string | null;
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
			className={clsx(`@mode-${color} @mode-dense`, className)}
			toggled={toggled}
			onClick={onToggle}
			{...rest}
		>
			<Icon name={icon || 'tag'} size={10} />
			<span>{name}</span>
		</Button>
	);
}
