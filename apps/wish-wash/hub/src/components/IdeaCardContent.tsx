import { HubWishlistItem } from '@/types.js';
import { Card, Dialog } from '@a-type/ui';
import { SearchButton, searchProviders } from '@wish-wash.biscuits/common';
import { ReactNode } from 'react';
import { ItemCardPrice } from './ItemCardPrice.jsx';
import { ItemCardTitle } from './ItemCardTitle.jsx';

export interface IdeaCardContentProps {
	item: HubWishlistItem;
	listAuthor: string;
	className?: string;
}

export function IdeaCardContent({
	item,
	listAuthor,
	className,
}: IdeaCardContentProps) {
	return (
		<IdeaCardBuyExperience item={item} listAuthor={listAuthor}>
			<Card.Main className={className}>
				<ItemCardTitle item={item} />
				<ItemCardPrice item={item} />
			</Card.Main>
		</IdeaCardBuyExperience>
	);
}

function IdeaCardBuyExperience({
	item,
	children,
	listAuthor,
}: {
	item: HubWishlistItem;
	children: ReactNode;
	listAuthor: string;
}) {
	return (
		<Dialog>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Idea: {item.description}</Dialog.Title>
				<Dialog.Description>
					{listAuthor} added this idea to their list as inspiration. Does it
					give you any ideas of your own?
				</Dialog.Description>
				<div className="row flex-wrap">
					{searchProviders.map((provider) => (
						<SearchButton prompt={item.description} provider={provider} />
					))}
				</div>
			</Dialog.Content>
		</Dialog>
	);
}
