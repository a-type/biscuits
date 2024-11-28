import { HubWishlistItem } from '@/types.js';
import { Card, Dialog, P } from '@a-type/ui';
import { FC, ReactNode } from 'react';
import { ItemCardTitle } from './ItemCardTitle.jsx';

export interface VibeCardContentProps {
	item: HubWishlistItem;
	className?: string;
	listAuthor: string;
}

export const VibeCardContent: FC<VibeCardContentProps> =
	function VibeCardContent({
		item,
		className,
		listAuthor,
	}: VibeCardContentProps) {
		return (
			<VibeCardBuyExperience item={item} listAuthor={listAuthor}>
				<Card.Main className={className}>
					<ItemCardTitle item={item} />
				</Card.Main>
			</VibeCardBuyExperience>
		);
	};

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
				<Dialog.Description></Dialog.Description>
				<P>{descriptionContent}</P>
				<Dialog.Actions>
					<Dialog.Close>Close</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
