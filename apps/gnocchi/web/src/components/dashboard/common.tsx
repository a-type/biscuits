import { Box, Card, withClassName, withProps } from '@a-type/ui';

export const DashboardContent = withClassName(
	withProps(Box, {
		d: 'col',
		gap: true,
	}),
	'after:(content-[""] absolute right-0 left-0 bottom-0 h-20px z-1 bg-gradient-to-t from-[color:var(--v-bg,var(--color-wash))] from-20% to-transparent pointer-events-none)',
);

export const CardTitle = withClassName(
	Card.Title,
	'text-nowrap text-ellipsis overflow-hidden',
);
export const CardContent = withClassName(
	withProps(Card.Content, { unstyled: true }),
	'flex flex-row gap-sm flex-wrap p-xs',
);
