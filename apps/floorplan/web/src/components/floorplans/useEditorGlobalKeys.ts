import { hooks } from '@/hooks.js';
import { Floor } from '@floorplan.biscuits/verdant';
import { useHotkeys } from 'react-hotkeys-hook';
import { editorState } from './editorState.js';

export function useEditorGlobalKeys(floor: Floor | null) {
	useHotkeys('escape', () => {
		editorState.selections = [];
	});

	const client = hooks.useClient();
	useHotkeys('delete', () => {
		const selections = editorState.selections;
		if (selections.length === 0) {
			return;
		}

		if (!floor) {
			return;
		}

		client.batch().run(() => {
			const lines = floor.get('lines');
			const shapes = floor.get('shapes');
			const labels = floor.get('labels');
			selections.forEach((id) => {
				const line = lines.get(id);
				if (line) {
					lines.delete(id);
				}
				const shape = shapes.get(id);
				if (shape) {
					shapes.delete(id);
				}
				const label = labels.get(id);
				if (label) {
					labels.delete(id);
				}
			});
		});
	});

	useHotkeys(['meta+a', 'ctrl+a'], (ev) => {
		ev.preventDefault();
		if (!floor) {
			return;
		}
		const lines = floor.get('lines');
		const shapes = floor.get('shapes');
		const labels = floor.get('labels');
		editorState.selections = [
			...lines.keys(),
			...shapes.keys(),
			...labels.keys(),
		];
	});
}
