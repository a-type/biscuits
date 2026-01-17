import { hooks } from '@/hooks.js';
import { Box, Button, clsx, Viewport } from '@a-type/ui';
import { UserMenu } from '@biscuits/client/apps';
import { Floor } from '@floorplan.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { Suspense } from 'react';
import { ConstraintToggles } from './ConstraintToggles.jsx';
import { FloorLine } from './FloorLine.jsx';
import { FloorProvider } from './FloorProvider.jsx';
import { Grid } from './Grid.jsx';
import { NewLine } from './NewLine.jsx';
import { Toolbar } from './Toolbar.jsx';
import { editorState } from './editorState.js';
import { useEditorGlobalKeys } from './useEditorGlobalKeys.js';

export interface FloorplanRendererProps {
	className?: string;
	id: string;
}

export function FloorplanRenderer({ className, id }: FloorplanRendererProps) {
	return (
		<Viewport
			className={clsx('h-full w-full flex flex-1 flex-col bg-gray', className)}
			gestureOptions={{
				filterDrag: (state) => {
					const isFirstButton = (state.buttons & 1) === 1;
					const isTouch = state.touches > 0;
					return (isFirstButton || isTouch) && editorState.tool !== 'pan';
				},
			}}
			maxZoom={1000}
			minZoom={10}
			defaultZoom={500}
		>
			<Suspense>
				<FloorplanContent id={id} />
			</Suspense>
			<Viewport.Control position="top-right">
				<UserMenu />
			</Viewport.Control>
			<Viewport.Control position="bottom-right">
				<Viewport.ZoomControls className="flex-row" />
			</Viewport.Control>
			<Viewport.Control position="top-left">
				<ConstraintToggles />
			</Viewport.Control>
			<Viewport.Control position="bottom-left">
				<Toolbar />
			</Viewport.Control>
		</Viewport>
	);
}

function FloorplanContent({ id }: { id: string }) {
	const floor = hooks.useFloor(id);

	useEditorGlobalKeys(floor);

	if (!floor) {
		return (
			<Box col gap>
				Missing floor <Button render={<Link to="/" />}>Go home</Button>
			</Box>
		);
	}

	return (
		<FloorProvider value={floor}>
			<svg width={100} height={100} className="relative bg-white">
				<g transform="translate(50, 50)">
					<Grid />
					<FloorplanLines floor={floor} />
					<NewLine floor={floor} />
				</g>
			</svg>
		</FloorProvider>
	);
}

function FloorplanLines({ floor }: { floor: Floor }) {
	const { lines } = hooks.useWatch(floor);
	hooks.useWatch(lines);

	return (
		<>
			{lines.map((line) => (
				<FloorLine floor={floor} key={line.get('id')} line={line} />
			))}
		</>
	);
}
