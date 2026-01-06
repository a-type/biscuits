import {
	Box,
	clsx,
	PaletteName,
	Popover,
	Slider,
	Tooltip,
	useThemedTitleBar,
} from '@a-type/ui';
import { getIsTouch } from '@biscuits/client';
import { useEffect, useRef, useState } from 'react';

const MOODS = [
	{ value: -2, label: '😞' },
	{ value: -1, label: '😕' },
	{ value: 0, label: '😐' },
	{ value: 1, label: '🙂' },
	{ value: 2, label: '😄' },
];

const min = Math.min(...MOODS.map((mood) => mood.value));
const max = Math.max(...MOODS.map((mood) => mood.value));

export interface MoodPickerProps {
	value: number | null;
	onValueChange: (val: number) => void;
	className?: string;
}

export function MoodPicker({
	value,
	onValueChange,
	className,
}: MoodPickerProps) {
	const [localValue, setLocalValue] = useState<number>(value ?? 0);

	useEffect(() => {
		setLocalValue(value ?? 0);
	}, [value]);

	const moodIcon =
		MOODS.find((mood) => mood.value === localValue)?.label ?? '❓';

	const [active, setActive] = useState(false);

	const palette: PaletteName =
		localValue < 0 ? 'attention'
		: localValue > 0 ? 'success'
		: 'primary';
	const shade = localValue === min || localValue === max ? 'light' : 'wash';
	useThemedTitleBar(palette, shade);

	const thumbRef = useRef<HTMLDivElement>(null);

	return (
		<Box
			p="lg"
			full
			layout="center center"
			className={clsx(
				'transition-colors',
				{
					'bg-attention-light': localValue === min,
					'bg-attention-wash':
						localValue !== null && localValue < 0 && localValue > min,
					'bg-main-wash': !localValue,
					'bg-success-wash':
						localValue !== null && localValue > 0 && localValue < max,
					'bg-success-light': localValue === max,
				},
				className,
			)}
		>
			<Tooltip
				content="Slide to select mood"
				open={!active && value === null}
				side="left"
			>
				<Slider.Base
					defaultValue={[0]}
					value={localValue !== null ? localValue : undefined}
					onValueChange={(val) => setLocalValue(val as number)}
					onValueCommitted={(val) => {
						onValueChange(val as number);
						setLocalValue(val as number);
						setActive(false);
					}}
					min={min}
					max={max}
					orientation="vertical"
					onPointerDown={() => {
						setActive(true);
					}}
					onPointerUp={() => {
						setActive(false);
						if (value === null) {
							onValueChange(localValue);
						}
					}}
					className="w-auto h-full"
				>
					<Slider.Track
						className={clsx('w-6', {
							'bg-attention': localValue === min,
							'bg-attention-light':
								localValue !== null && localValue < 0 && localValue > min,
							'bg-main-light': !localValue,
							'bg-success-light':
								localValue !== null && localValue > 0 && localValue < max,
							'bg-success': localValue === max,
						})}
					>
						<Popover open={active && getIsTouch()}>
							<Slider.Thumb
								className={clsx(
									'w-touch-large h-touch-large text-2xl',
									value === null && 'border-dashed',
								)}
								ref={thumbRef}
							>
								{value === null && !active ? '' : moodIcon}
							</Slider.Thumb>

							<Popover.Content
								anchor={thumbRef}
								side="left"
								sideOffset={16}
								className="min-w-0 min-h-0"
							>
								<Box p="xs" col gap layout="center center" className="text-3xl">
									{moodIcon}
								</Box>
							</Popover.Content>
						</Popover>
					</Slider.Track>
				</Slider.Base>
			</Tooltip>
		</Box>
	);
}
