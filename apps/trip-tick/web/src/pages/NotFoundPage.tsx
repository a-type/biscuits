import { Button, H1, PageContent } from '@a-type/ui';
import { usePageTitle } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';

export interface NotFoundPageProps {}

export function NotFoundPage({}: NotFoundPageProps) {
	usePageTitle('Not found');
	return (
		<PageContent>
			<div className="flex flex-col items-start gap-4">
				<H1>Not Found</H1>
				<Button render={<Link to="/" />}>Go Home</Button>
			</div>
		</PageContent>
	);
}

export default NotFoundPage;
