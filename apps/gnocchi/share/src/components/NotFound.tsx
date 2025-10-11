import { Box, Button } from '@a-type/ui';

export function NotFound({ children }: { children?: any }) {
	return (
		<Box full layout="center center" col p gap>
			<div>
				{children || <p>The page you are looking for does not exist.</p>}
			</div>
			<Button onClick={() => window.history.back()}>Go back</Button>
		</Box>
	);
}
