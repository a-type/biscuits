import { Button, H1, PageContent, PageRoot } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';

const NotFoundPage = () => {
	return (
		<PageRoot>
			<PageContent>
				<H1>Not found</H1>
				<Button render={<Link to="/" />}>Go home</Button>
			</PageContent>
		</PageRoot>
	);
};

export default NotFoundPage;
