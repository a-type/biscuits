import {
	Box,
	clsx,
	Popover,
	Slider,
	Tooltip,
	useThemedTitleBar,
} from '@a-type/ui';
import { getIsTouch } from '@biscuits/client';
import { useEffect, useRef, useState } from 'react';
import cls from './MoodPicker.module.css';

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
	...rest
}: MoodPickerProps) {
	const [localValue, setLocalValue] = useState<number>(value ?? 0);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setLocalValue(value ?? 0);
	}, [value]);

	const moodIcon =
		MOODS.find((mood) => mood.value === localValue)?.label ?? '❓';

	const [active, setActive] = useState(false);

	const palette: string =
		localValue < 0 ? 'attention'
		: localValue > 0 ? 'success'
		: 'primary';
	const shade = localValue === min || localValue === max ? 'light' : 'wash';
	useThemedTitleBar(palette, shade);

	const thumbRef = useRef<HTMLDivElement>(null);

	return (
		<Box
			{...rest}
			p="lg"
			full
			layout="center center"
			color={
				localValue < 0 ? 'attention'
				: localValue > 0 ?
					'success'
				:	'primary'
			}
			surface={
				localValue === min || localValue === max ? 'primary' : 'secondary'
			}
			className={clsx(cls.picker, className)}
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
					className="h-full w-auto"
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
								className={cls.thumb}
								data-has-value={value !== null}
								ref={thumbRef}
							>
								{value === null && !active ? '' : moodIcon}
							</Slider.Thumb>

							<Popover.Content
								anchor={thumbRef}
								side="left"
								sideOffset={16}
								style={{ minHeight: 0, minWidth: 0 }}
							>
								<Box p="xs" col gap layout="center center" className={cls.icon}>
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
