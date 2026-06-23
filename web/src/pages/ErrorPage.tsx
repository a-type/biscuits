import { Heading, P, PageContent, PageRoot } from '@a-type/ui';

export interface ErrorPageProps {}

export function ErrorPage({}: ErrorPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<Heading emphasis="primary">Something went wrong</Heading>
				<P>Sorry, we couldn&apos;t load this page. Please try again later.</P>
			</PageContent>
		</PageRoot>
	);
}

export default ErrorPage;
