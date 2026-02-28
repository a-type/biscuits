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
			selections.forEach((id) => {
				const line = lines.get(id);
				if (line) {
					lines.delete(id);
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
		editorState.selections = lines.keys();
		console.log('selecting all', editorState.selections);
	});
}
