import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	Icon,
} from '@a-type/ui';
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
			<DialogContent width="lg">
				<div className="flex flex-row items-start gap-2">
					<DialogTitle className="flex-1">{title}</DialogTitle>
					<DialogClose asChild>
						<Button size="small" color="ghost">
							<Icon name="x" />
						</Button>
					</DialogClose>
				</div>
				{description && <Dialog.Description>{description}</Dialog.Description>}
				{children}
				<DialogActions>
					<div className="flex flex-col gap-2 items-center m-auto mt-1">
						<LoginButton
							color="primary"
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
					</div>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
