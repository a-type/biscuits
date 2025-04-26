import { HubWishlistItem } from '@/types.js';
import { Button, Dialog, DialogActions } from '@a-type/ui';
import { SearchButton, searchProviders } from '@wish-wash.biscuits/common';
import { ReactNode, useEffect, useState } from 'react';
import { ItemCardPurchases } from './ItemCardPurchases.js';
import { PostBuyExperienceContent } from './PostBuyExperienceContent.js';

export function SearchAndBuyExperience({
	item,
	children,
	listAuthor,
	description,
}: {
	item: HubWishlistItem;
	listAuthor: string;
	children: ReactNode;
	description?: ReactNode;
}) {
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
			<Dialog.Content>
				{showPost ?
					<PostBuyExperienceContent item={item} listAuthor={listAuthor} />
				:	<PreBuyExperienceContent
						item={item}
						description={description}
						listAuthor={listAuthor}
					/>
				}
				<DialogActions>
					{showPost && (
						<Button
							color="ghost"
							onClick={() => setShowPost(false)}
							className="mr-auto"
						>
							What was it again?
						</Button>
					)}
					<Dialog.Close>Close</Dialog.Close>
				</DialogActions>
			</Dialog.Content>
		</Dialog>
	);
}

function PreBuyExperienceContent({
	item,
	description,
	listAuthor,
}: {
	item: HubWishlistItem;
	description?: ReactNode;
	listAuthor: string;
}) {
	return (
		<>
			<Dialog.Title>Search for {item.description}</Dialog.Title>
			<ItemCardPurchases item={item} className="!bg-accent-wash mr-auto" />
			<Dialog.Description>
				{description || (
					<>
						Find something online that fits the bill, then come back here to
						tell {listAuthor} you bought it!
					</>
				)}
			</Dialog.Description>
			<div className="row flex-wrap">
				{searchProviders.map((provider) => (
					<SearchButton prompt={item.description} provider={provider} />
				))}
			</div>
		</>
	);
}
