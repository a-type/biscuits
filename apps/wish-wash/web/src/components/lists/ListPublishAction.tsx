import {
	ActionButton,
	ActionButtonProps,
	Box,
	Button,
	clsx,
	Dialog,
	Divider,
	H3,
	Icon,
	P,
} from '@a-type/ui';
import { DomainRouteView, useHasServerAccess } from '@biscuits/client';
import { graphql, useMutation, useQuery } from '@biscuits/graphql';
import { Link } from '@verdant-web/react-router';
import type { PublicWishlist } from '@wish-wash.biscuits/share-schema';
import { List } from '@wish-wash.biscuits/verdant';
import { upsellState } from '../promotion/upsellState.js';

export interface ListPublishActionProps extends ActionButtonProps {
	list: List;
}

const publishedListQuery = graphql(`
	query PublishedListQuery($listId: ID!) {
		publishedWishlist(id: $listId) {
			id
			url
		}
	}
`);

export function ListPublishAction({
	list,
	className,
	...rest
}: ListPublishActionProps) {
	const canPublish = useHasServerAccess();

	const { data } = useQuery(publishedListQuery, {
		variables: { listId: list.get('id') },
		skip: !canPublish,
	});
	const isPublished = data?.publishedWishlist;

	if (!canPublish && !isPublished) {
		return (
			<ActionButton
				emphasis="light"
				color="accent"
				{...rest}
				className={clsx('self-start', className)}
				onClick={() => (upsellState.show = true)}
			>
				<Icon name="send" />
				Share list
			</ActionButton>
		);
	}

	return (
		<Dialog>
			<Dialog.Trigger
				render={
					<ActionButton
						emphasis="light"
						color="accent"
						{...rest}
						className={clsx('self-start', className)}
					/>
				}
			>
				<Icon name="send" />
				{isPublished ? 'Sharing' : 'Share list'}
			</Dialog.Trigger>
			<Dialog.Content>
				<Box col gap>
					{isPublished ?
						<ManagePublishedList
							list={list}
							url={data.publishedWishlist?.url ?? ''}
						/>
					:	<PublishList list={list} />}
				</Box>
			</Dialog.Content>
		</Dialog>
	);
}

const publishList = graphql(`
	mutation PublishListMutation($listId: ID!, $data: JSON!) {
		publishWishlist(input: { id: $listId, data: $data }) {
			id
		}
	}
`);

const unpublishList = graphql(`
	mutation UnpublishListMutation($listId: ID!) {
		unpublishWishlist(wishlistId: $listId)
	}
`);

function PublishList({ list }: { list: List }) {
	const [doPublish] = useMutation(publishList, {
		variables: { listId: list.get('id'), data: getPublicWishlistData(list) },
		refetchQueries: [publishedListQuery],
	});

	const publish = async () => {
		await doPublish();
	};

	return (
		<>
			<Dialog.Title>Publish list</Dialog.Title>
			<P>
				You can share your list as a link with anyone, and they can mark items
				as purchased if they buy them for you!
			</P>
			<Dialog.Actions>
				<Dialog.Close>Cancel</Dialog.Close>
				<Button emphasis="primary" onClick={publish}>
					Publish
				</Button>
			</Dialog.Actions>
		</>
	);
}

function ManagePublishedList({ list, url }: { list: List; url: string }) {
	const [doUnpublish] = useMutation(unpublishList, {
		variables: { listId: list.get('id') },
		refetchQueries: [publishedListQuery],
	});

	const [doRepublish, { loading: republishLoading }] = useMutation(
		publishList,
		{
			variables: { listId: list.get('id'), data: getPublicWishlistData(list) },
			refetchQueries: [publishedListQuery],
		},
	);

	return (
		<>
			<Dialog.Title>Manage sharing</Dialog.Title>
			<Box d="col" gap="sm">
				<P className="mb-2">
					Your list is currently public on the internet. You can unpublish it at
					any time.
				</P>
				<Button
					emphasis="light"
					color="accent"
					className="self-start"
					render={<Link to={url} newTab />}
				>
					View your list <Icon name="new_window" />
				</Button>
				<Button
					emphasis="default"
					className="self-start"
					onClick={() => doRepublish()}
					loading={republishLoading}
				>
					Republish
				</Button>
			</Box>
			<Divider />
			<Box d="col" gap="sm">
				<H3>Custom domain</H3>
				<P>
					If you own a domain, you can set up a subdomain to point to your list.
				</P>
				<DomainRouteView resourceId={list.get('id')} />
			</Box>
			<Dialog.Actions>
				<Button
					color="attention"
					emphasis="ghost"
					onClick={() => doUnpublish()}
				>
					Unpublish
				</Button>
				<Dialog.Close>Done</Dialog.Close>
			</Dialog.Actions>
		</>
	);
}

function getPublicWishlistData(wishlist: List): PublicWishlist {
	const snapshot = wishlist.getSnapshot();
	return {
		...snapshot,
		title: snapshot.name,
		items: snapshot.items.map((item) => ({
			...item,
			imageUrls: item.imageFiles
				.map((file) => file.url)
				.filter((url): url is string => !!url),
		})),
	};
}
