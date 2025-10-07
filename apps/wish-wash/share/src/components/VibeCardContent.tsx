import { HubWishlistItem } from '@/types.js';
import { Dialog, P } from '@a-type/ui';
import { SearchButton } from '@wish-wash.biscuits/common';
import { ReactNode } from 'react';
import { ItemCardImageGallery } from './ItemCardImageGallery.jsx';
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
	return (
		<>
			<Dialog>
				<Dialog.Trigger asChild>{children}</Dialog.Trigger>
				<Dialog.Content width="lg">
					{item.description && <Dialog.Title>{item.description}</Dialog.Title>}
					<ItemCardImageGallery item={item} maxCols={3} />
					<P>Be on the lookout for stuff that feels like this.</P>
					<Dialog.Actions>
						{item.description && (
							<SearchButton prompt={item.description} className="mr-auto" />
						)}
						<Dialog.Close>Close</Dialog.Close>
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
		</>
	);
}
