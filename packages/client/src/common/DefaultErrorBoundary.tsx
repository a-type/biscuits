import { Box, Button, ErrorBoundary, H1, P } from '@a-type/ui';
import { Link } from '@biscuits/client';
import { ReloadButton } from './ReloadButton.js';

export function DefaultErrorFallback({
	clearError,
}: {
	clearError: () => void;
}) {
	return (
		<Box col items="center" justify="center" p>
			<Box
				col
				items="start"
				justify="center"
				gap
				style={{ maxWidth: 'min-content' }}
			>
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed. You can try refreshing, but if
					that doesn't work, use the button below to report the issue.
				</P>
				<Button render={<Link to="/" onClick={clearError} />}>Go Home</Button>
				<ReloadButton />
			</Box>
		</Box>
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
