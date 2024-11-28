import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@a-type/ui';
import classNames from 'classnames';
import { useTemperatureUnit } from './useTemperatureUnit.js';

export function TemperatureUnit() {
	const { unit } = useTemperatureUnit();
	return <span>{unit === 'fahrenheit' ? '°F' : '°C'}</span>;
}

export function TemperatureUnitSelect({ className }: { className?: string }) {
	const { unit, setUnit } = useTemperatureUnit();

	return (
		<div className={classNames('flex flex-row gap-2 items-center', className)}>
			Temperature unit:
			<Select value={unit} onValueChange={setUnit}>
				<SelectTrigger>
					<SelectValue />
					<SelectIcon />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="fahrenheit">°F</SelectItem>
					<SelectItem value="celsius">°C</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
