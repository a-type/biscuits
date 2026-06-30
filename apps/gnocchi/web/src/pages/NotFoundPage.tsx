import { Link } from '@/components/nav/Link.jsx';
import { Box, Button, PageContent } from '@a-type/ui';

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
