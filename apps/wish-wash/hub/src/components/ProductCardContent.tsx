import React from 'react';
import { HubWishlistItem } from '@/types.js';
import { Card } from '@a-type/ui/components/card';
import { ItemCardTitle } from './ItemCardTitle.jsx';
import { ItemCardPrice } from './ItemCardPrice.jsx';
import { Dialog, DialogActions } from '@a-type/ui/components/dialog';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@a-type/ui/components/button';
import { P } from '@a-type/ui/components/typography';
import { FormikForm, SubmitButton } from '@a-type/ui/components/forms';
import { usePurchaseItem } from '@/hooks.js';
import { NumberStepperField } from '@a-type/ui/components/forms/NumberStepperField';
import { SearchButton } from '@wish-wash.biscuits/common';

export interface ProductCardContentProps {
	item: HubWishlistItem;
	className?: string;
	listAuthor: string;
}

export function ProductCardContent({
	item,
	className,
	listAuthor,
}: ProductCardContentProps) {
	return (
		<ProductCardBuyExperience item={item} listAuthor={listAuthor}>
			<Card.Main className={className}>
				<ItemCardTitle item={item} />
				<ItemCardPrice item={item} />
			</Card.Main>
		</ProductCardBuyExperience>
	);
}

function ProductCardBuyExperience({
	item,
	...rest
}: {
	item: HubWishlistItem;
	children: ReactNode;
	listAuthor: string;
}) {
	const link = item.links[0];

	if (link) {
		return <ProductLinkBuyExperience item={item} link={link} {...rest} />;
	}

	return <ProductSearchBuyExperience item={item} {...rest} />;
}

function ProductLinkBuyExperience({
	item,
	children,
	listAuthor,
	link,
}: {
	item: HubWishlistItem;
	listAuthor: string;
	children: ReactNode;
	link: string;
}) {
	const [showPost, setShowPost] = useState(false);

	const onVisit = () => {
		setShowPost(true);
	};

	return (
		<Dialog>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Content>
				{showPost ?
					<PreLinkBuyExperienceContent
						item={item}
						listAuthor={listAuthor}
						onVisit={onVisit}
						link={link}
					/>
				:	<PostLinkBuyExperienceContent item={item} listAuthor={listAuthor} />}
				{showPost}
			</Dialog.Content>
		</Dialog>
	);
}

function PreLinkBuyExperienceContent({
	item,
	link,
	onVisit,
	listAuthor,
}: {
	item: HubWishlistItem;
	listAuthor: string;
	link: string;
	onVisit: () => void;
}) {
	const needs = item.count - item.purchasedCount;
	return (
		<>
			<Dialog.Title>Visit the store page</Dialog.Title>
			<Dialog.Description>
				Come back to this tab to mark this item as purchased when you're done!
			</Dialog.Description>
			<P>
				{listAuthor} wants {needs}
			</P>
			<Dialog.Actions>
				<Dialog.Close>Close</Dialog.Close>
				<Button asChild color="primary" onClick={onVisit}>
					<a href={link} target="_blank" rel="noreferrer">
						Go to store page
					</a>
				</Button>
			</Dialog.Actions>
		</>
	);
}

function PostLinkBuyExperienceContent({
	item,
	listAuthor,
}: {
	item: HubWishlistItem;
	listAuthor: string;
}) {
	const needs = item.count - item.purchasedCount;
	const [purchase] = usePurchaseItem(item.id);

	return (
		<FormikForm
			initialValues={{ quantity: 1, name: 'Anonymous' }}
			onSubmit={async (values, form) => {
				await purchase(values);
				form.resetForm();
			}}
		>
			<Dialog.Title>Did you buy ${item.description}?</Dialog.Title>
			{needs > 1 ?
				<>
					<Dialog.Description>
						Tell {listAuthor} how many you bought to avoid duplicates
					</Dialog.Description>
					<NumberStepperField name="quantity" label="I bought..." />
					<SubmitButton>Done</SubmitButton>
				</>
			:	<Dialog.Description>
					Tell {listAuthor} you bought it to avoid duplicates
				</Dialog.Description>
			}
		</FormikForm>
	);
}

function ProductSearchBuyExperience({
	item,
	children,
	listAuthor,
}: {
	item: HubWishlistItem;
	listAuthor: string;
	children: ReactNode;
}) {
	return (
		<Dialog>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Search for {item.description}</Dialog.Title>
				<Dialog.Description>
					Find something online that fits the bill, then come back here to tell{' '}
					{listAuthor} you bought it!
				</Dialog.Description>
				<DialogActions>
					<SearchButton prompt={item.description} />
				</DialogActions>
			</Dialog.Content>
		</Dialog>
	);
}
