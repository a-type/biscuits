import { Button, clsx, Icon } from '@a-type/ui';
import { useMemo } from 'react';
import { useSelectedObjectIds } from '../canvas/canvasHooks.js';
import { CanvasOverlayContent } from '../canvas/CanvasOverlay.jsx';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { useDeleteConnection, useDeleteTask } from './hooks.js';

export interface SelectionMenuProps {
	className?: string;
}

export function SelectionMenu({ className }: SelectionMenuProps) {
	const selectedIds = useSelectedObjectIds();
	const hasSelection = selectedIds.length > 1;

	const canvas = useCanvas();
	const deleteTask = useDeleteTask();
	const deleteConnection = useDeleteConnection();

	const [tasks, connections] = useMemo(() => {
		const tasks = selectedIds.filter((id) => {
			const metadata = canvas.objectMetadata.get(id);
			return metadata?.type === 'task';
		});
		const connections = selectedIds.filter((id) => {
			const metadata = canvas.objectMetadata.get(id);
			return metadata?.type === 'connection';
		});
		return [tasks, connections];
	}, [selectedIds, canvas]);

	const deleteSelected = async (only?: 'task' | 'connection') => {
		await Promise.all(
			selectedIds.map((id) => {
				const metadata = canvas.objectMetadata.get(id);
				if (!metadata) return;

				if (metadata.type === 'task' && only !== 'connection') {
					return deleteTask(id).then((deletedIds) => {
						canvas.selections.removeAll(deletedIds);
					});
				} else if (metadata.type === 'connection' && only !== 'task') {
					return deleteConnection(id).then(() => {
						canvas.selections.remove(id);
					});
				}
			}),
		);
	};

	const mixed = tasks.length > 0 && connections.length > 0;

	return (
		<CanvasOverlayContent
			className={clsx(
				'bg-white rounded-lg shadow-xl p-3 col hidden min-w-200px max-w-80dvw',
				'absolute z-100 bottom-1 left-50% transform -translate-1/2',
				hasSelection && 'flex animate-dialog-in',
				className,
			)}
		>
			<div className="font-bold">
				{selectedIds.length}{' '}
				{mixed ?
					'items'
				: tasks.length > 0 ?
					'tasks'
				:	'connections'}{' '}
				selected
			</div>
			<div className="row flex-wrap justify-stretch">
				{mixed && (
					<Button
						onClick={() => deleteSelected('connection')}
						color="ghostDestructive"
						size="small"
						className="flex-1 justify-center"
					>
						<Icon name="connectionBreak" />
						Delete Connections
					</Button>
				)}
				<Button
					onClick={() => deleteSelected()}
					color="ghostDestructive"
					size="small"
					className="flex-1 justify-center"
				>
					<Icon name="trash" />
					Delete All
				</Button>
			</div>
		</CanvasOverlayContent>
	);
}
