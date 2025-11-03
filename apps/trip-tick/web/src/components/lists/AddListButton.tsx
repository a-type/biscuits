import { hooks } from '@/store.js';
import { Button, ButtonProps } from '@a-type/ui';
import { useMe } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';

export interface AddListButtonProps extends ButtonProps {}

export function AddListButton({
	children,
	className,
	...rest
}: AddListButtonProps) {
	const client = hooks.useClient();
	const navigate = useNavigate();
	const { data: me } = useMe();
	const allLists = hooks.useAllLists();
	const hasLists = allLists.length > 0;

	return (
		<Button
			emphasis="primary"
			onClick={async () => {
				if (hasLists) {
					const list = await client.lists.put({
						name: 'New list',
					});
					navigate(`/lists/${list.get('id')}`, {
						skipTransition: true,
					});
				} else {
					const listName = me ? me.me.name : `My stuff`;
					const list = await client.lists.put({
						name: listName,
					});
					navigate(`/lists/${list.get('id')}`, {
						skipTransition: true,
					});
				}
			}}
			className={className}
			{...rest}
		>
			{children || 'Add list'}
		</Button>
	);
}
