import { Box, H1, P } from '@a-type/ui';
import { CreateListOptions } from '../lists/CreateListOptions.jsx';

export interface FirstListProps {}

export function FirstList({}: FirstListProps) {
	return (
		<Box col gap="lg">
			<H1>Welcome to Wish Wash!</H1>
			<P>Let's get started with your first list.</P>
			<CreateListOptions />
		</Box>
	);
}
