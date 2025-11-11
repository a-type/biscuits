import { ColorModeToggle } from '@a-type/ui';

export function DarkModeToggle() {
	return (
		<div className="flex gap-2 items-center">
			<span>Color mode:</span>
			<ColorModeToggle />
		</div>
	);
}
