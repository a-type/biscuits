import { Box, Button, Dialog, Icon } from '@a-type/ui';
import { graphql, useQuery } from '@biscuits/graphql';
import { ReactNode } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { LoginButton } from './LoginButton.js';
import { Price } from './Price.js';

const subscriptionPromotionState = proxy({
	status: 'closed' as 'closed' | 'open',
	title: 'Upgrade for sync & more',
	description: '',
});

export function showSubscriptionPromotion(
	title: string = 'Upgrade for sync & more',
	description: string = '',
) {
	subscriptionPromotionState.status = 'open';
	subscriptionPromotionState.title = title;
	subscriptionPromotionState.description = description;
}

export interface SubscriptionPromotionProps {
	children: ReactNode;
}

const promotionProductQuery = graphql(`
	query PromotionProduct {
		productInfo(lookupKey: "for_one") {
			id
			price
			currency
			period
		}
	}
`);

export function SubscriptionPromotion({
	children,
}: SubscriptionPromotionProps) {
	const { status, title, description } = useSnapshot(
		subscriptionPromotionState,
	);
	const { data } = useQuery(promotionProductQuery);
	const price = data?.productInfo.price;
	const currency = data?.productInfo.currency;
	const period = data?.productInfo.period;

	return (
		<Dialog
			open={status !== 'closed'}
			onOpenChange={(open) => {
				if (!open) {
					subscriptionPromotionState.status = 'closed';
				}
			}}
		>
			<Dialog.Content width="lg">
				<Box items="start" gap="sm">
					<Dialog.Title className="flex-1">{title}</Dialog.Title>
					<Dialog.Close render={<Button size="small" emphasis="ghost" />}>
						<Icon name="x" />
					</Dialog.Close>
				</Box>
				{description && <Dialog.Description>{description}</Dialog.Description>}
				{children}
				<Dialog.Actions>
					<Box
						col
						items="center"
						gap="sm"
						style={{ margin: 'auto', marginTop: '4px' }}
					>
						<LoginButton
							emphasis="primary"
							returnTo="/"
							onClick={() => (subscriptionPromotionState.status = 'closed')}
						>
							Join the club
						</LoginButton>
						<span className="text-xs">
							Starting at{' '}
							<Price value={price} currency={currency} period={period} />. 14
							days free.
						</span>
					</Box>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
