import { hooks } from '@/hooks.js';
import { toast } from '@a-type/ui';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
import { authorization, List } from '@wish-wash.biscuits/verdant';
import { useCallback } from 'react';

export function useEditList() {
	const [_, setParams] = useSearchParams();
	return useCallback(
		(listId: string) => {
			setParams((p) => {
				p.set('listId', listId);
				return p;
			});
		},
		[setParams],
	);
}

export function useReordering() {
	const [search, setSearch] = useSearchParams();
	const reordering = search.get('reordering') === 'true';
	return [
		reordering,
		useCallback(
			(value: boolean) => {
				setSearch((s) => {
					s.set('reordering', value ? 'true' : 'false');
					return s;
				});
			},
			[setSearch],
		),
	] as const;
}

export function useDeleteList(list: List) {
	const navigate = useNavigate();
	return useCallback(async () => {
		if (list) {
			list.deleteSelf();
			toast.success('List deleted');
			navigate('/');
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
			navigate(`/${converted.get('id')}`);
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
			navigate(`/${converted.get('id')}`);
		}
	}, [client, list, navigate]);
}
