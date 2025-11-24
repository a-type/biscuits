import { Box, Button } from '@a-type/ui';

const MOODS = [
	{ value: -2, label: '😞' },
	{ value: -1, label: '😕' },
	{ value: 0, label: '😐' },
	{ value: 1, label: '🙂' },
	{ value: 2, label: '😄' },
];

export interface MoodPickerProps {
	value: number | null;
	onValueChange: (val: number) => void;
	row?: boolean;
}

export function MoodPicker({ value, onValueChange, row }: MoodPickerProps) {
	return (
		<Box className={row ? 'flex-row' : 'flex-col'}>
			{MOODS.map((mood) => (
				<Box
					key={mood.value}
					onClick={() => onValueChange(mood.value)}
					className="w-full flex-1 p-md"
					layout="center center"
				>
					<Button toggled={value === mood.value}>{mood.label}</Button>
				</Box>
			))}
		</Box>
	);
}
