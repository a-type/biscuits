import { hooks } from '@/hooks.js';
import { Box, Chip, H2, Icon, Tooltip } from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
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
		<Box col gap p>
			<Box items="center" gap="lg">
				<AccessIcon entry={entry} />
				<H2>
					{date.toLocaleDateString(undefined, {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</H2>
			</Box>
			<Box gap wrap items="center">
				<Chip>{format(date, 'EEEE')}</Chip>
			</Box>
		</Box>
	);
}

function AccessIcon({ entry }: { entry: Entry }) {
	const hasSync = useHasServerAccess();

	if (!hasSync) return null;

	return (
		<Tooltip
			content={
				entry.isAuthorized ? 'Only you can see this' : 'Shared with your plan'
			}
		>
			<Icon size={20} name={entry.isAuthorized ? 'lock' : 'lockOpen'} />
		</Tooltip>
	);
}
