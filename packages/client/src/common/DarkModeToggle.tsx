import { Box, ColorModeToggle } from '@a-type/ui';

export function DarkModeToggle() {
	return (
		<Box items="center" gap="sm">
			<span>Color mode:</span>
			<ColorModeToggle />
		</Box>
	);
}
