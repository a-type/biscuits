import { clsx } from '@a-type/ui';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogActions,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { Icon } from '@a-type/ui/components/icon';
import { P } from '@a-type/ui/components/typography';
import { graphql, useCanSync, useMutation, useQuery } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';

export interface ListPublishButtonProps extends ButtonProps {
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

export function ListPublishButton({
  listId,
  className,
  ...rest
}: ListPublishButtonProps) {
  const canPublish = useCanSync();

  const { data } = useQuery(publishedListQuery, { variables: { listId } });
  const isPublished = data?.publishedWishlist;

  if (!canPublish && !isPublished) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          color={isPublished ? 'default' : 'accent'}
          {...rest}
          className={clsx('self-start', className)}
        >
          <Icon name="send" />
          {isPublished ? 'Edit sharing' : 'Share list'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {isPublished ? (
          <ManagePublishedList
            listId={listId}
            url={data.publishedWishlist?.url ?? ''}
          />
        ) : (
          <PublishList listId={listId} />
        )}
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
        <Button onClick={publish}>Publish</Button>
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
      <P>
        Your list is currently public on the internet. You can unpublish it at
        any time.
      </P>
      <Link to={url} newTab>
        View your list <Icon name="new_window" />
      </Link>
      <DialogActions>
        <Button onClick={unpublish}>Unpublish</Button>
      </DialogActions>
    </>
  );
}
