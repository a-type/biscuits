import {
	ActionButton,
	ActionButtonProps,
	Button,
	clsx,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Icon,
	P,
} from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';
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
			<DialogTrigger asChild>
				<ActionButton
					color={isPublished ? 'default' : 'accent'}
					{...rest}
					className={clsx('self-start', className)}
				>
					<Icon name="send" />
					{isPublished ? 'Edit sharing' : 'Share list'}
				</ActionButton>
			</DialogTrigger>
			<DialogContent>
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
				<DialogClose asChild>
					<Button>Cancel</Button>
				</DialogClose>
				<Button color="primary" onClick={publish}>
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
			<P className="mb-2">
				Your list is currently public on the internet. You can unpublish it at
				any time.
			</P>
			<Button asChild color="accent" className="self-start">
				<Link to={url} newTab>
					View your list <Icon name="new_window" />
				</Link>
			</Button>
			<DialogActions>
				<Button color="ghostDestructive" onClick={unpublish}>
					Unpublish
				</Button>
				<DialogClose asChild>
					<Button>Done</Button>
				</DialogClose>
			</DialogActions>
		</>
	);
}
