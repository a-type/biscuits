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
				const line = lines.find((val) => val.get('id') === id);
				if (line) {
					lines.removeAll(line);
				}
			});
		});
	});
}
