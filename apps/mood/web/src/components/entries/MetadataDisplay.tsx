import { hooks } from '@/hooks.js';
import { Box, Chip, H2 } from '@a-type/ui';
import { Entry } from '@mood.biscuits/verdant';
import { format } from 'date-fns';

export interface MetadataDisplayProps {
	entry: Entry;
	className?: string;
}

export function MetadataDisplay({ entry, className }: MetadataDisplayProps) {
	const { createdAt } = hooks.useWatch(entry);
	const date = new Date(createdAt);

	return (
		<Box col gap>
			<H2>
				{date.toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})}
			</H2>
			<Box gap wrap p items="center">
				<Chip>{format(date, 'EEEE')}</Chip>
			</Box>
		</Box>
	);
}
