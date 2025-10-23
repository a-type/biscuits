import { hooks } from '@/hooks.js';
import { Box, Button } from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
import { graphql, useMutation, useQuery } from '@biscuits/graphql';
import { List } from '@wish-wash.biscuits/verdant';

const getPurchases = graphql(`
	query GetPurchases($listId: ID!) {
		wishlistPurchases(wishlistId: $listId) {
			id
			createdAt
			purchasedBy
			confirmedAt
			quantity
			itemId
		}
	}
`);

const confirmPurchases = graphql(`
	mutation ConfirmPurchases($purchaseIds: [ID!]!) {
		confirmPurchases(purchaseIds: $purchaseIds)
	}
`);

export interface SyncPurchasesProps {
	className?: string;
	list: List;
}

export function SyncPurchases({ className, list }: SyncPurchasesProps) {
	const hasAccess = useHasServerAccess();

	const { id: listId, confirmedRemotePurchases, items } = hooks.useWatch(list);
	hooks.useWatch(confirmedRemotePurchases);
	const { data, loading, refetch } = useQuery(getPurchases, {
		variables: { listId },
		skip: !hasAccess,
	});

	const [confirm, { loading: confirming }] = useMutation(confirmPurchases);
	const client = hooks.useClient();

	if (!hasAccess || loading || !data) {
		return null;
	}

	const unconfirmedPurchases = data.wishlistPurchases.filter(
		(purchase) =>
			!purchase.confirmedAt && !confirmedRemotePurchases.includes(purchase.id),
	);

	if (unconfirmedPurchases.length === 0) {
		return null;
	}

	return (
		<Box col gap items="start" surface="accent" p className={className}>
			<span className="text-lg font-bold">Good things coming...</span>
			<span>
				Some of your items have been purchased by others. We don't want to spoil
				the surprise... Click the button to reveal them when you're ready!
			</span>
			<Button
				onClick={async () => {
					await client
						.batch({ undoable: false })
						.run(() => {
							const purchasedQuantities: Record<string, number> = {};
							for (const purchase of unconfirmedPurchases) {
								purchasedQuantities[purchase.itemId] =
									(purchasedQuantities[purchase.itemId] ?? 0) +
									purchase.quantity;
							}
							for (const [id, purchasedCount] of Object.entries(
								purchasedQuantities,
							)) {
								const item = items.find((item) => item.get('id') === id);
								if (item) {
									item.set(
										'purchasedCount',
										item.get('purchasedCount') + purchasedCount,
									);
								}
							}
						})
						.commit();
					await confirm({
						variables: {
							purchaseIds: unconfirmedPurchases.map((purchase) => purchase.id),
						},
					});
					await refetch();
				}}
				loading={confirming}
			>
				Reveal
			</Button>
		</Box>
	);
}
