import { Button, ErrorBoundary, H1, P } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { ReloadButton } from './ReloadButton.js';

export function DefaultErrorFallback({
	clearError,
}: {
	clearError: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="flex flex-col items-start justify-center gap-4 max-w-content">
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed. You can try refreshing, but if
					that doesn't work, use the button below to report the issue.
				</P>
				<Button render={<Link to="/" onClick={clearError} />}>Go Home</Button>
				<ReloadButton />
			</div>
		</div>
	);
}

export function DefaultErrorBoundary({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ErrorBoundary fallback={(props) => <DefaultErrorFallback {...props} />}>
			{children}
		</ErrorBoundary>
	);
}
