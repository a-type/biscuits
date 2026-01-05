import {
	ActionButton,
	ActionButtonProps,
	Box,
	Button,
	clsx,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Divider,
	H3,
	Icon,
	P,
} from '@a-type/ui';
import { DomainRouteView, useHasServerAccess } from '@biscuits/client';
import { graphql, useMutation, useQuery } from '@biscuits/graphql';
import { Link } from '@verdant-web/react-router';
import { upsellState } from '../promotion/upsellState.js';

export interface ListPublishActionProps extends ActionButtonProps {
	listId: string;
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
	listId,
	className,
	...rest
}: ListPublishActionProps) {
	const canPublish = useHasServerAccess();

	const { data } = useQuery(publishedListQuery, {
		variables: { listId },
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
			<DialogTrigger
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
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-lg">
				{isPublished ?
					<ManagePublishedList
						listId={listId}
						url={data.publishedWishlist?.url ?? ''}
					/>
				:	<PublishList listId={listId} />}
			</DialogContent>
		</Dialog>
	);
}

const publishList = graphql(`
	mutation PublishListMutation($listId: ID!) {
		publishWishlist(input: { id: $listId }) {
			id
		}
	}
`);

const unpublishList = graphql(`
	mutation UnpublishListMutation($listId: ID!) {
		unpublishWishlist(wishlistId: $listId)
	}
`);

function PublishList({ listId }: { listId: string }) {
	const [doPublish] = useMutation(publishList, {
		variables: { listId },
		refetchQueries: [publishedListQuery],
	});

	const publish = async () => {
		await doPublish();
	};

	return (
		<>
			<DialogTitle>Publish list</DialogTitle>
			<P>
				You can share your list as a link with anyone, and they can mark items
				as purchased if they buy them for you!
			</P>
			<DialogActions>
				<DialogClose>Cancel</DialogClose>
				<Button emphasis="primary" onClick={publish}>
					Publish
				</Button>
			</DialogActions>
		</>
	);
}

function ManagePublishedList({ listId, url }: { listId: string; url: string }) {
	const [doUnpublish] = useMutation(unpublishList, {
		variables: { listId },
		refetchQueries: [publishedListQuery],
	});

	const unpublish = async () => {
		await doUnpublish();
	};

	return (
		<>
			<DialogTitle>Manage sharing</DialogTitle>
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
			</Box>
			<Divider />
			<Box d="col" gap="sm">
				<H3>Custom domain</H3>
				<P>
					If you own a domain, you can set up a subdomain to point to your list.
				</P>
				<DomainRouteView resourceId={listId} />
			</Box>
			<DialogActions>
				<Button color="attention" emphasis="ghost" onClick={unpublish}>
					Unpublish
				</Button>
				<DialogClose>Done</DialogClose>
			</DialogActions>
		</>
	);
}
