import { hooks } from '@/hooks.js';
import {
	Box,
	BoxProps,
	Button,
	CalendarDayValue,
	clsx,
	DatePicker,
	Icon,
	Popover,
} from '@a-type/ui';
import { addDays, startOfDay } from 'date-fns';
import { Suspense, useState } from 'react';

export interface NavigateEntriesProps extends BoxProps {
	className?: string;
	value: number;
	onValueChange: (value: number) => void;
}

export function NavigateEntries({
	value,
	onValueChange,
	className,
	...rest
}: NavigateEntriesProps) {
	const normalized = startOfDay(new Date(value));
	const isToday = normalized.getTime() === startOfDay(new Date()).getTime();
	const previous = hooks.useOneEntry({
		index: {
			where: 'createdAt',
			lt: normalized.getTime(),
			order: 'desc',
		},
	});
	const next = hooks.useOneEntry({
		index: {
			where: 'createdAt',
			gte: addDays(normalized, 1).getTime(),
			order: 'asc',
		},
	});

	return (
		<Box
			surface="white"
			border
			gap
			elevated="md"
			className={clsx('fixed left-sm top-sm z-1', className)}
			{...rest}
		>
			<Button
				size="small"
				emphasis="ghost"
				disabled={!previous}
				onClick={() => onValueChange(previous!.get('createdAt'))}
			>
				<Icon name="previous" />
			</Button>
			<CalendarPicker
				value={normalized}
				onChange={(v) => onValueChange(v.getTime())}
			/>
			<Button
				size="small"
				emphasis="ghost"
				disabled={!next}
				onClick={() => onValueChange(next!.get('createdAt'))}
			>
				<Icon name="next" />
			</Button>
			<Button
				size="small"
				emphasis="ghost"
				disabled={isToday}
				onClick={() => onValueChange(startOfDay(Date.now()).getTime())}
			>
				<Icon name="skipEnd" />
			</Button>
		</Box>
	);
}

function CalendarPicker({
	value,
	onChange,
}: {
	value: Date;
	onChange: (value: Date) => void;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Popover.Trigger render={<Button size="small" emphasis="ghost" />}>
				<Icon name="calendar" />
			</Popover.Trigger>
			<Popover.Content side="bottom" align="start">
				<DatePicker.Root
					value={value}
					onChange={(d) => {
						if (!d) return;
						onChange(d);
						setOpen(false);
					}}
				>
					<DatePicker.MonthControls />
					<DatePicker.CalendarGrid>
						{(day) => (
							<Suspense
								key={day.key}
								fallback={<DatePicker.CalendarDay value={day} disabled />}
							>
								<DateWithEntry value={day} key={day.key} />
							</Suspense>
						)}
					</DatePicker.CalendarGrid>
				</DatePicker.Root>
			</Popover.Content>
		</Popover>
	);
}

function DateWithEntry({ value }: { value: CalendarDayValue }) {
	const entry = hooks.useOneEntry({
		index: {
			where: 'date',
			equals: startOfDay(value.date).getTime(),
		},
	});
	hooks.useWatch(entry);
	const moodValue = entry?.get('value') ?? Infinity;

	return (
		<DatePicker.CalendarDay
			value={value}
			disabled={!entry}
			className={clsx(
				{
					'bg-attention-light': moodValue === -2,
					'bg-attention': moodValue === -1,
					'bg-neutral-light': moodValue === 0,
					'bg-success-light': moodValue === 1,
					'bg-success': moodValue === 2,
				},
				'[&[data-selected=true]]:(ring ring-2 ring-offset-1 ring-bg)',
			)}
		/>
	);
}
