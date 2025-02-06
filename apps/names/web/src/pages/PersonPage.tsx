import { PersonDetails } from '@/components/people/PersonDetails.jsx';
import { hooks } from '@/hooks.js';
import { Button, H1, Icon, PageContent, PageRoot } from '@a-type/ui';
import { usePageTitle } from '@biscuits/client';
import { Link, useParams } from '@verdant-web/react-router';

export interface PersonPageProps {}

export function PersonPage({}: PersonPageProps) {
	const { id } = useParams();

	const person = hooks.usePerson(id);

	usePageTitle(person?.get('name') || 'Names');

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
				<Button asChild className="mr-auto mb-4" color="ghost">
					<Link to="/">
						<Icon name="arrowLeft" />
						Home
					</Link>
				</Button>
				<PersonDetails person={person} />
			</PageContent>
		</PageRoot>
	);
}

export default PersonPage;
