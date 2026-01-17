import { ColorModeToggle } from '@a-type/ui';

export function DarkModeToggle() {
	return (
		<div className="flex items-center gap-2">
			<span>Color mode:</span>
			<ColorModeToggle />
		</div>
	);
}
