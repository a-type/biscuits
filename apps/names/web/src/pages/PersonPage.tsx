import { PersonDetails } from '@/components/people/PersonDetails.jsx';
import { hooks } from '@/hooks.js';
import { Button, H1, Icon } from '@a-type/ui';
import { usePageTitle } from '@biscuits/client';
import { Link, useParams } from '@verdant-web/react-router';

export interface PersonPageProps {}

export function PersonPage({}: PersonPageProps) {
	const { id } = useParams();

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
		<>
			<Button
				className="mb-4 mr-auto"
				emphasis="ghost"
				render={<Link to="/" />}
			>
				<Icon name="arrowLeft" />
				Home
			</Button>
			<PersonDetails person={person} />
		</>
	);
}

export default PersonPage;
