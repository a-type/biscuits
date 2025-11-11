import { Button, Dialog, DialogActions } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { ReactNode, useEffect, useState } from 'react';
import { itemCardImageGalleryFragment } from '../cardParts/ItemCardImageGallery.js';
import { ItemCardPurchaseButton } from '../cardParts/ItemCardPurchaseButton.js';
import { itemCardPurchasesFragment } from '../cardParts/ItemCardPurchases.js';
import {
	PostBuyExperienceContent,
	postBuyExperienceContentFragment,
} from './PostBuyExperienceContent.js';
import {
	PreBuyExperienceContent,
	preBuyExperienceContentFragment,
} from './PreBuyExperienceContent.js';

export const searchAndBuyExperienceFragment = graphql(
	`
		fragment SearchAndBuyExperience on PublicWishlistItem {
			id
			...ItemCardImageGallery
			...ItemCardPurchases
			...PostBuyExperienceContent
			...PreBuyExperienceContent
		}
	`,
	[
		itemCardImageGalleryFragment,
		itemCardPurchasesFragment,
		postBuyExperienceContentFragment,
		preBuyExperienceContentFragment,
	],
);

export function SearchAndBuyExperience({
	item: itemMasked,
	children,
	listAuthor,
	description,
}: {
	item: FragmentOf<typeof searchAndBuyExperienceFragment>;
	listAuthor: string;
	children: ReactNode;
	description?: ReactNode;
}) {
	const item = readFragment(searchAndBuyExperienceFragment, itemMasked);
	const [open, setOpen] = useState(false);
	const [showPost, setShowPost] = useState(false);
	useEffect(() => {
		if (!open) return;

		function trigger() {
			setShowPost(true);
		}
		window.addEventListener('blur', trigger);
		return () => {
			window.removeEventListener('blur', trigger);
		};
	}, [open]);

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
				if (!open) {
					setShowPost(false);
				}
			}}
		>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Content width="lg" className="gap-md">
				{showPost ?
					<PostBuyExperienceContent item={item} listAuthor={listAuthor} />
				:	<PreBuyExperienceContent
						item={item}
						description={description}
						listAuthor={listAuthor}
					/>
				}
				<DialogActions>
					{showPost ?
						<Button
							emphasis="ghost"
							onClick={() => setShowPost(false)}
							className="mr-auto"
							size="default"
						>
							What was it again?
						</Button>
					:	<ItemCardPurchaseButton
							itemId={item.id}
							className="mr-auto"
							size="default"
						/>
					}
					<Dialog.Close>Close</Dialog.Close>
				</DialogActions>
			</Dialog.Content>
		</Dialog>
	);
}
