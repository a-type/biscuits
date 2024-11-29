import { PersonDetails } from '@/components/people/PersonDetails.jsx';
import { hooks } from '@/hooks.js';
import { Button, H1, PageContent, PageRoot } from '@a-type/ui';
import { Link, useParams } from '@verdant-web/react-router';

export interface PersonPageProps {}

export function PersonPage({}: PersonPageProps) {
	const { id } = useParams();

	const person = hooks.usePerson(id);

	if (!person) {
		return (
			<PageRoot>
				<PageContent>
					<H1>Not found</H1>
					<Button asChild>
						<Link to="/">Go back</Link>
					</Button>
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<PageRoot>
			<PageContent>
				<PersonDetails person={person} />
			</PageContent>
		</PageRoot>
	);
}

export default PersonPage;
