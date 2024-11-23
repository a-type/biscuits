import { H1, P } from '@a-type/ui/components/typography';
import { CreateListOptions } from '../lists/CreateListOptions.jsx';

export interface FirstListProps {}

export function FirstList({}: FirstListProps) {
	return (
		<div className="col gap-6">
			<H1>Welcome to Wish Wash!</H1>
			<P>Let's get started with your first list.</P>
			<CreateListOptions />
		</div>
	);
}
