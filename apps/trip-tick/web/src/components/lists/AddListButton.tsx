import { hooks } from '@/store.js';
import { Button, ButtonProps } from '@a-type/ui';
import { useMe } from '@biscuits/client';
import { useNavigate as useTanstackNavigate } from '@tanstack/react-router';

export interface AddListButtonProps extends ButtonProps {}

export function AddListButton({
	children,
	className,
	...rest
}: AddListButtonProps) {
	const client = hooks.useClient();
	const navigate = useTanstackNavigate();
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
					navigate({
						to: `/lists/${list.get('id')}`,
						viewTransition: false,
					});
				} else {
					const listName = me ? me.me.name : `My stuff`;
					const list = await client.lists.put({
						name: listName,
					});
					navigate({
						to: `/lists/${list.get('id')}`,
						viewTransition: false,
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
