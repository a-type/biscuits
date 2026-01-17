import { Button } from '@a-type/ui';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent, useRouter } from '@tanstack/react-router';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	const router = useRouter();

	console.error('DefaultCatchBoundary Error:', error);

	return (
		<div className="min-w-0 flex flex-1 flex-col items-center justify-center gap-6 p-4">
			<ErrorComponent error={error} />
			<div className="flex flex-wrap items-center gap-2">
				<Button
					onClick={() => {
						router.invalidate();
					}}
				>
					Try Again
				</Button>
			</div>
		</div>
	);
}
