import { Button } from '@a-type/ui';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent, useRouter } from '@tanstack/react-router';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	const router = useRouter();

	console.error('DefaultCatchBoundary Error:', error);

	return (
		<div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
			<ErrorComponent error={error} />
			<div className="flex gap-2 items-center flex-wrap">
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
