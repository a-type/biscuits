import { H1, P, PageContent, PageRoot } from '@a-type/ui';

export interface ErrorPageProps {}

export function ErrorPage({}: ErrorPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<H1>Something went wrong</H1>
				<P>Sorry, we couldn&apos;t load this page. Please try again later.</P>
			</PageContent>
		</PageRoot>
	);
}

export default ErrorPage;
