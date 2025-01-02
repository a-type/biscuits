import { Link } from '@/components/nav/Link.jsx';
import { Button, PageContent } from '@a-type/ui';

export function NotFoundPage() {
	return (
		<PageContent>
			<div className="flex flex-col gap-3">
				<span>Page not found.</span>
				<Link to="/">
					<Button>Go home</Button>
				</Link>
			</div>
		</PageContent>
	);
}
