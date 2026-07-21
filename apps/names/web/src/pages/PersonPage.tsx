import { PersonDetails } from '@/components/people/PersonDetails.jsx';
import { hooks } from '@/hooks.js';
import { Box, Button, H1, Icon } from '@a-type/ui';
import { Link, usePageTitle } from '@biscuits/client';
import { useParams } from '@tanstack/react-router';

export interface PersonPageProps {}

export function PersonPage({}: PersonPageProps) {
	const { id } = useParams({ from: '/people/$id' });

	const person = hooks.usePerson(id);

	usePageTitle(person?.get('name') || 'Not found');

	if (!person) {
		return (
			<>
				<H1>Not found</H1>
				<Button render={<Link to="/" />}>Go back</Button>
			</>
		);
	}

	return (
		<Box
			col
			gap
			items="stretch"
			style={{
				width: '100%',
				maxWidth: 600,
				marginInline: 'auto',
				marginBottom: 300,
			}}
		>
			<Button emphasis="ghost" render={<Link to="/" />} align="start">
				<Icon name="arrowLeft" />
				Home
			</Button>
			<PersonDetails person={person} />
		</Box>
	);
}

export default PersonPage;
