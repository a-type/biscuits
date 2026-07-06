import { Select } from '@a-type/ui';

export interface ColorPickerProps {
	value: string | null;
	onValueChange: (color: string | null) => void;
}

export function ColorPicker({ value, onValueChange }: ColorPickerProps) {
	const colors = [
		{ value: 'lemon', label: 'Lemon' },
		{ value: 'leek', label: 'Leek' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'eggplant', label: 'Eggplant' },
		{ value: 'tomato', label: 'Tomato' },
	];
	return (
		<Select value={value} onValueChange={onValueChange} items={colors}>
			<Select.Trigger>
				<Select.Value>{(color) => <Swatch color={color} />}</Select.Value>
				<Select.Icon />
			</Select.Trigger>
			<Select.Content>
				{colors.map((color) => (
					<Select.Item key={color.value} value={color.value}>
						<Swatch color={color.value} />
					</Select.Item>
				))}
			</Select.Content>
		</Select>
	);
}

const Swatch = ({ color }: { color: string }) => (
	<div
		style={{
			width: 16,
			height: 16,
			backgroundColor: 'var(--m-color-main)',
			borderRadius: 4,
		}}
		className={`@mode-${color}`}
		aria-label={color}
	/>
);
