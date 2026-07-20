import { Box, Button, PageContent } from '@a-type/ui';
import { Link } from '@biscuits/client';

export function NotFoundPage() {
	return (
		<PageContent>
			<Box col gap>
				<span>Page not found.</span>
				<Link to="/">
					<Button>Go home</Button>
				</Link>
			</Box>
		</PageContent>
	);
}

export default NotFoundPage;
