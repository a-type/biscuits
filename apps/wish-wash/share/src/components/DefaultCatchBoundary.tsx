import { Box, Button } from '@a-type/ui';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent, useRouter } from '@tanstack/react-router';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	const router = useRouter();

	console.error('DefaultCatchBoundary Error:', error);

	return (
		<Box grow col layout="center" p gap>
			<ErrorComponent error={error} />
			<Box wrap items="center" gap>
				<Button
					onClick={() => {
						router.invalidate();
					}}
				>
					Try Again
				</Button>
			</Box>
		</Box>
	);
}
