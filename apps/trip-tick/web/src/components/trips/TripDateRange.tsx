import { hooks } from '@/store.js';
import {
	Button,
	DateRangePicker,
	Icon,
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@a-type/ui';
import { Trip } from '@trip-tick.biscuits/verdant';
import format from 'date-fns/format';
import { useState } from 'react';
import { useTripDays } from './hooks.js';

export interface TripDateRangeProps {
	trip: Trip;
}

const nbsp = '\u00A0'; // non-breaking space
// day, month date(th)
function formatDay(date: Date) {
	return format(date, `EEE,${nbsp}MMM${nbsp}do`);
}

export function TripDateRange({ trip }: TripDateRangeProps) {
	const { startsAt, endsAt } = hooks.useWatch(trip);
	const days = useTripDays(trip);
	const nights = Math.max(0, days - 1);

	const displayString =
		startsAt && endsAt ?
			`${formatDay(new Date(startsAt))} - ${formatDay(
				new Date(endsAt),
			)} (${days}${nbsp}days,${nbsp}${nights}${nbsp}nights)`
		:	'Select dates';

	const value = {
		start: startsAt ? new Date(startsAt) : null,
		end: endsAt ? new Date(endsAt) : null,
	};
	const onChange = (newDates: { start: Date | null; end: Date | null }) => {
		if (!newDates.start || !newDates.end) {
			return;
		}
		trip.set('startsAt', newDates.start.getTime());
		trip.set('endsAt', newDates.end.getTime());
		setOpen(false);
	};

	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					color={nights === 0 ? 'primary' : 'ghost'}
					className={
						nights === 0 ? 'ml-4' : 'font-normal text-wrap text-start text-sm'
					}
				>
					<Icon name="calendar" />
					<span>{displayString}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="z-dialog color-black">
				<PopoverArrow />
				<DateRangePicker value={value} onChange={onChange} />
			</PopoverContent>
		</Popover>
	);
}
