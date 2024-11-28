import { hooks } from '@/hooks.js';
import { ActionButton, Icon } from '@a-type/ui';
import { Project } from '@palette.biscuits/verdant';
import { useColorSelection } from '../projects/hooks.js';

export function DeleteColorAction({ project }: { project: Project }) {
	const { colors } = hooks.useWatch(project);

	const [selectedId, selectId] = useColorSelection();

	const deleteSelectedColor = () => {
		if (selectedId) {
			const val = colors.find((c) => c.get('id') === selectedId);
			if (val) {
				colors.removeAll(val);
			}
			selectId(null);
		}
	};

	return (
		<ActionButton
			color="destructive"
			onClick={deleteSelectedColor}
			icon={<Icon name="trash" />}
			visible={!!selectedId}
		>
			Delete color
		</ActionButton>
	);
}
