import { ActionButton } from '@a-type/ui/components/actions';
import { ColorSort, useSort } from '../projects/hooks.js';
import { Icon } from '@a-type/ui/components/icon';

export function SortAction() {
	const [sort, setSort] = useSort();

	const goNext = () => {
		const currentIndex = orderedOptions.indexOf(sort);
		const nextIndex = (currentIndex + 1) % orderedOptions.length;
		setSort(orderedOptions[nextIndex]);
	};

	return (
		<ActionButton
			onClick={goNext}
			icon={<Icon name="drag_vertical" />}
			className="capitalize"
		>
			{sort}
		</ActionButton>
	);
}

const orderedOptions: ColorSort[] = ['hue', 'saturation', 'lightness'];
