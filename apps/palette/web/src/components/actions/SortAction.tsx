import { ActionButton, Icon } from '@a-type/ui';
import { ColorSort, useSort } from '../projects/hooks.js';

export function SortAction() {
	const [sort, setSort] = useSort();

	const goNext = () => {
		const currentIndex = orderedOptions.indexOf(sort);
		const nextIndex = (currentIndex + 1) % orderedOptions.length;
		setSort(orderedOptions[nextIndex]);
	};

	return (
		<ActionButton onClick={goNext} className="capitalize">
			<Icon name="drag_vertical" />
			{sort}
		</ActionButton>
	);
}

const orderedOptions: ColorSort[] = ['hue', 'saturation', 'lightness'];
