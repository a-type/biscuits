import { List } from '@wish-wash.biscuits/verdant';
import { AddPane } from './AddPane.jsx';
import { AddSection } from './AddSection.jsx';

export interface AddItemProps {
	list: List;
}

export function AddItem({ list }: AddItemProps) {
	return (
		<>
			<AddPane className="sm:hidden" list={list} />
			<AddSection
				className="layer-components:hidden sm:flex py-6 max-w-400px w-full m-auto"
				list={list}
			/>
		</>
	);
}
