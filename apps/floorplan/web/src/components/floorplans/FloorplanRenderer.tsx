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
			className={clsx('bg-gray w-full h-full flex-1 flex flex-col', className)}
			gestureOptions={{
				filterDrag: (state) => {
					const isFirstButton = (state.buttons & 1) === 1;
					const isTouch = state.touches > 0;
					return (isFirstButton || isTouch) && editorState.tool !== 'pan';
				},
			}}
			maxZoom={100}
			minZoom={1}
			defaultZoom={50}
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
				Missing floor{' '}
				<Button asChild>
					<Link to="/">Go home</Link>
				</Button>
			</Box>
		);
	}

	return (
		<FloorProvider value={floor}>
			<svg width={1000} height={1000} className="bg-white relative">
				<g transform="translate(500, 500)">
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
