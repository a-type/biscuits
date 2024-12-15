import {
	Button,
	CardContent,
	CardGrid,
	CardMain,
	CardRoot,
	CardTitle,
	H2,
	P,
} from '@a-type/ui';
import { useMutation, useQuery } from '@biscuits/graphql';
import { Suspense } from 'react';
import { graphql } from '../../graphql.js';
import { Price } from '../Price.js';

export interface SubscriptionSelectProps {
	priceKeys?: PriceKey[];
}

const CreatePlan = graphql(`
	mutation CreatePlan($input: SetupPlanInput!) {
		setupPlan(input: $input) {
			user {
				id
				plan {
					id
					checkoutData {
						subscriptionId
						clientSecret
					}
				}
			}
		}
	}
`);

export type PriceKey = 'for_one' | 'family_style' | 'wishwash_yearly';
const defaultPriceKeys: PriceKey[] = ['for_one', 'family_style'];

export function SubscriptionSelect({
	priceKeys = defaultPriceKeys,
}: SubscriptionSelectProps) {
	const [createPlan, result] = useMutation(CreatePlan, {
		refetchQueries: ['PlanSubscriptionInfo'],
	});

	const selectPlan = async (lookupKey: string) => {
		await createPlan({
			variables: {
				input: {
					priceLookupKey: lookupKey,
				},
			},
		});
	};

	// only one key ... show a different experience
	if (priceKeys.length === 1) {
		return (
			<SinglePriceExperience
				priceKey={priceKeys[0]}
				onProceed={() =>
					createPlan({
						variables: { input: { priceLookupKey: priceKeys[0] } },
					})
				}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<H2>Select a Plan</H2>
			<Suspense>
				<CardGrid>
					{priceKeys.map((lookupKey) => (
						<SubscriptionChoiceButton
							key={lookupKey}
							disabled={result.loading}
							onClick={() => selectPlan(lookupKey)}
							lookupKey={lookupKey as PriceKey}
						/>
					))}
				</CardGrid>
			</Suspense>
		</div>
	);
}

const subscriptionPlanInfo = graphql(`
	query SubscriptionPlanInfo($lookupKey: String!) {
		productInfo(lookupKey: $lookupKey) {
			id
			price
			currency
			name
			description
			period
		}
	}
`);

function SubscriptionChoiceButton({
	disabled,
	onClick,
	lookupKey,
}: {
	disabled: boolean;
	onClick: () => void;
	lookupKey: PriceKey;
}) {
	const { data } = useQuery(subscriptionPlanInfo, {
		variables: { lookupKey },
	});
	return (
		<CardRoot>
			<CardMain asChild>
				<button onClick={onClick} disabled={disabled}>
					<CardTitle>{data?.productInfo.name}</CardTitle>
					<CardContent>{data?.productInfo.description}</CardContent>
					<CardContent>
						<Price
							value={data?.productInfo.price}
							currency={data?.productInfo.currency}
							period={data?.productInfo.period}
						/>
					</CardContent>
				</button>
			</CardMain>
		</CardRoot>
	);
}

function SinglePriceExperience({
	priceKey,
	onProceed,
}: {
	priceKey: PriceKey;
	onProceed: () => void;
}) {
	const { data } = useQuery(subscriptionPlanInfo, {
		variables: { lookupKey: priceKey },
	});

	return (
		<div className="flex flex-col gap-3 items-start">
			<H2>Checkout</H2>
			<P>
				You're about to subscribe to {data?.productInfo.name} for{' '}
				<Price
					value={data?.productInfo.price}
					currency={data?.productInfo.currency}
					period={data?.productInfo.period}
				/>
				.
			</P>
			<Button color="primary" onClick={onProceed}>
				Enter payment info
			</Button>
		</div>
	);
}
