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
			emphasis="primary"
			color="attention"
			onClick={deleteSelectedColor}
			visible={!!selectedId}
		>
			<Icon name="trash" />
			Delete color
		</ActionButton>
	);
}
