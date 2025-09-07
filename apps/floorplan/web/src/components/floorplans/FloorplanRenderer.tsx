import { hooks } from '@/hooks.js';
import { Viewport } from '@a-type/ui';
import { Suspense } from 'react';

export interface FloorplanRendererProps {
	className?: string;
	id: string;
}

export function FloorplanRenderer({ className, id }: FloorplanRendererProps) {
	return (
		<Viewport className={className}>
			<Suspense>
				<FloorplanContent id={id} />
			</Suspense>
			<Viewport.Control>
				<Viewport.ZoomControls />
			</Viewport.Control>
		</Viewport>
	);
}

function FloorplanContent({ id }: { id: string }) {
	const floor = hooks.useFloor(id);

	return <div></div>;
}
