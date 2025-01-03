import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@a-type/ui';
import { useEffect, useState } from 'react';
import {
	getColorMode,
	setColorMode,
	subscribeToColorModeChange,
} from '../darkMode.js';

export function DarkModeToggle() {
	const [colorMode, setColorModeInternal] = useState<
		'light' | 'dark' | 'system'
	>(getColorMode);
	useEffect(() => subscribeToColorModeChange(setColorModeInternal), []);

	return (
		<div className="flex gap-2 items-center">
			<span>Color theme:</span>
			<Select value={colorMode} onValueChange={setColorMode}>
				<SelectTrigger>
					<SelectValue />
					<SelectIcon />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="system">System</SelectItem>
					<SelectItem value="light">Light</SelectItem>
					<SelectItem value="dark">Dark</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
