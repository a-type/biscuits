import { Box, Button, Dialog, Icon } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { ReactNode, useEffect, useState } from 'react';
import {
	PostBuyExperienceContent,
	postBuyExperienceContentFragment,
} from './PostBuyExperienceContent.js';
import {
	SearchAndBuyExperience,
	searchAndBuyExperienceFragment,
} from './SearchAndBuyExperience.js';

export const linkBuyExperienceFragment = graphql(
	`
		fragment LinkBuyExperience on PublicWishlistItem {
			id
			links
			count
			purchasedCount
			...SearchAndBuyExperience
			...PostBuyExperienceContent
		}
	`,
	[searchAndBuyExperienceFragment, postBuyExperienceContentFragment],
);

export function LinkBuyExperience({
	item: itemMasked,
	listAuthor,
	children,
}: {
	item: FragmentOf<typeof linkBuyExperienceFragment>;
	listAuthor: string;
	children?: ReactNode;
}) {
	const item = readFragment(linkBuyExperienceFragment, itemMasked);
	const [open, setOpen] = useState(false);
	const [showPost, setShowPost] = useState(false);

	const onVisit = () => {
		setShowPost(true);
	};

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

	const link = item.links[0];

	if (!link) {
		return (
			<SearchAndBuyExperience item={item} listAuthor={listAuthor}>
				{children}
			</SearchAndBuyExperience>
		);
	}

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
			<Dialog.Content className="flex flex-col gap-md">
				{showPost ?
					<PostBuyExperienceContent item={item} listAuthor={listAuthor} />
				:	<PreLinkBuyExperienceContent
						item={itemMasked}
						listAuthor={listAuthor}
						onVisit={onVisit}
						link={link}
					/>
				}
				<Dialog.Actions>
					{showPost && (
						<Button
							color="ghost"
							onClick={() => setShowPost(false)}
							className="mr-auto"
						>
							What was it again?
						</Button>
					)}
					<Dialog.Close />
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

function PreLinkBuyExperienceContent({
	item: itemMasked,
	link,
	onVisit,
	listAuthor,
}: {
	item: FragmentOf<typeof linkBuyExperienceFragment>;
	listAuthor: string;
	link: string;
	onVisit: () => void;
}) {
	const item = readFragment(linkBuyExperienceFragment, itemMasked);
	const needs = Math.max(0, item.count - item.purchasedCount);
	return (
		<>
			<Dialog.Title>Visit the store page</Dialog.Title>
			<Dialog.Description>
				Come back to this tab to mark this item as purchased when you're done!
			</Dialog.Description>
			{needs === 0 && item.count > 0 ?
				<Box surface="attention" p>
					This item is already purchased!
				</Box>
			:	<Box surface="primary" p>
					{listAuthor} wants {needs}
					{item.count > 1 ? ' more' : ''}
				</Box>
			}
			<Button asChild color="primary" onClick={onVisit}>
				<a href={link} target="_blank" rel="noreferrer">
					Go to store page
					<Icon name="new_window" />
				</a>
			</Button>
		</>
	);
}
