import { TagFilter } from '../tags/TagFilter.jsx';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarTagFilterProps {}

export function SuperBarTagFilter({}: SuperBarTagFilterProps) {
	const { tagFilter, setTagFilter } = useSuperBar();

	return (
		<TagFilter
			className="py-sm"
			value={tagFilter}
			onToggle={(name) =>
				setTagFilter((v) => {
					if (v.includes(name)) {
						return v.filter((n) => n !== name);
					} else {
						return [...v, name];
					}
				})
			}
		/>
	);
}
