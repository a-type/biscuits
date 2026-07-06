import { Button, H1, P, PageContent, PageRoot } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import classes from './NotFoundPage.module.css';

export interface NotFoundPageProps {}

export function NotFoundPage({}: NotFoundPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<div className={classes.container}>
					<H1>404 Not Found</H1>
					<P>
						Lots of people put cute graphics on this page, but I&apos;m just too
						busy!
					</P>
					<Button
						render={<Link to="/" />}
						className={classes.selfStart}
						emphasis="primary"
					>
						Go home
					</Button>
				</div>
			</PageContent>
		</PageRoot>
	);
}

export default NotFoundPage;
