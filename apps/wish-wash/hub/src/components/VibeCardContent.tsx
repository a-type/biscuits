import { HubWishlistItem } from '@/types.js';
import { Dialog, P } from '@a-type/ui';
import { ReactNode } from 'react';
import { ItemCardMain } from './ItemCardMain.js';
import { ItemCardNote } from './ItemCardNote.js';
import { ItemCardPurchases } from './ItemCardPurchases.js';
import { ItemCardTitle } from './ItemCardTitle.js';
import { ItemCardTypeChip } from './ItemCardTypeChip.js';

export interface VibeCardContentProps {
	item: HubWishlistItem;
	className?: string;
	listAuthor: string;
}

export function VibeCardContent({
	item,
	className,
	listAuthor,
}: VibeCardContentProps) {
	return (
		<VibeCardBuyExperience item={item} listAuthor={listAuthor}>
			<ItemCardMain item={item} className={className}>
				<ItemCardTypeChip item={item} />
				<ItemCardTitle item={item} />
				<ItemCardPurchases item={item} />
				<ItemCardNote item={item} />
			</ItemCardMain>
		</VibeCardBuyExperience>
	);
}

function VibeCardBuyExperience({
	item,
	children,
	listAuthor,
}: {
	item: HubWishlistItem;
	children: ReactNode;
	listAuthor: string;
}) {
	let descriptionContent = `Looks like ${listAuthor} didn't add any more notes to this one.`;
	if (item.description) {
		descriptionContent = item.description;
	}
	return (
		<Dialog>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Shop this vibe</Dialog.Title>
				<P>{descriptionContent}</P>
				<Dialog.Actions>
					<Dialog.Close>Close</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
