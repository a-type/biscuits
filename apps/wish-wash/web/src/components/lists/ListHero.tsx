import { hooks } from '@/hooks.js';
import { EditableText, Icon } from '@a-type/ui';
import { List } from '@wish-wash.biscuits/verdant';

export interface ListHeroProps {
	list: List;
}

export function ListHero({ list }: ListHeroProps) {
	const { name, id } = hooks.useWatch(list);

	return (
		<div className="col items-start">
			<div className="flex flex-row items-center">
				<Icon name={list.isAuthorized ? 'lock' : 'add_person'} />
				<EditableText
					className="text-xl font-bold"
					value={name}
					onValueChange={(v) => list.set('name', v)}
				/>
			</div>
		</div>
	);
}
