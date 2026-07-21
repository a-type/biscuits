import { hooks } from '@/hooks.js';
import { toast } from '@a-type/ui';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { authorization, List } from '@wish-wash.biscuits/verdant';
import { useCallback } from 'react';

export function useEditList() {
	const navigate = useNavigate();
	return useCallback(
		(listId: string) => {
			navigate({
				replace: true,
				search: (prev) => ({ ...prev, listId }) as never,
			});
		},
		[navigate],
	);
}

export function useReordering() {
	const search = useSearch({ strict: false }) as Record<string, string>;
	const navigate = useNavigate();
	const reordering = search.reordering === 'true';
	return [
		reordering,
		useCallback(
			(value: boolean) => {
				navigate({
					replace: true,
					search: (prev) =>
						({
							...prev,
							reordering: value ? 'true' : 'false',
						}) as never,
				});
			},
			[navigate],
		),
	] as const;
}

export function useDeleteList(list: List) {
	const navigate = useNavigate();
	return useCallback(async () => {
		if (list) {
			list.deleteSelf();
			toast.success('List deleted');
			navigate({ to: '/' });
		}
	}, [list, navigate]);
}

export function useConvertToShared(list: List) {
	const navigate = useNavigate();
	const client = hooks.useClient();
	return useCallback(async () => {
		if (list) {
			if (!list.isAuthorized) {
				return;
			}
			const converted = await client.lists.clone(list, {
				access: authorization.public,
				undoable: false,
			});
			list.deleteSelf();
			navigate({ to: `/${converted.get('id')}` });
		}
	}, [client, list, navigate]);
}

export function useConvertToPrivate(list: List) {
	const navigate = useNavigate();
	const client = hooks.useClient();
	return useCallback(async () => {
		if (list) {
			if (list.isAuthorized) {
				return;
			}
			const converted = await client.lists.clone(list, {
				access: authorization.private,
				undoable: false,
			});
			list.deleteSelf();
			navigate({ to: `/${converted.get('id')}` });
		}
	}, [client, list, navigate]);
}
