import { Button, H1, P, PageContent, PageRoot } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';

export interface NotFoundPageProps {}

export function NotFoundPage({}: NotFoundPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<div className="flex flex-col gap-6 relative px-8">
					<H1>404 Not Found</H1>
					<P>
						Lots of people put cute graphics on this page, but I&apos;m just too
						busy!
					</P>
					<Button asChild className="self-start" emphasis="primary">
						<Link to="/">Go home</Link>
					</Button>
				</div>
			</PageContent>
		</PageRoot>
	);
}

export default NotFoundPage;
