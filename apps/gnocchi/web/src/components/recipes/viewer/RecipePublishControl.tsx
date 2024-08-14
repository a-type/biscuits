import { TextLink } from '@/components/nav/Link.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@a-type/ui/components/button';
import { Checkbox } from '@a-type/ui/components/checkbox';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogActions,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { Tooltip } from '@a-type/ui/components/tooltip';
import { P } from '@a-type/ui/components/typography';
import {
  graphql,
  useHasServerAccess,
  useFeatureFlag,
  useMutation,
  useQuery,
} from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { format } from 'date-fns/esm';
import { useState } from 'react';
import { toast } from '@a-type/ui';

export interface RecipePublishControlProps {
  recipe: Recipe;
}

const publishedQuery = graphql(`
  query RecipePublishData($recipeId: ID!) {
    publishedRecipe(id: $recipeId) {
      id
      publishedAt
      url
    }
  }
`);

const publishMutation = graphql(`
  mutation PublishRecipe($input: PublishRecipeInput!) {
    publishRecipe(input: $input) {
      id
      publishedAt
    }
  }
`);

const unpublishMutation = graphql(`
  mutation UnpublishRecipe($recipeId: ID!) {
    unpublishRecipe(recipeId: $recipeId) {
      id
      publishedAt
    }
  }
`);

export function RecipePublishControl({ recipe }: RecipePublishControlProps) {
  const enabled = useFeatureFlag('hub');
  const { data, loading, refetch } = useQuery(publishedQuery, {
    variables: { recipeId: recipe.get('id') },
  });

  const { url } = hooks.useWatch(recipe);
  const notAllowed = !!url;

  const canPublish = useHasServerAccess();

  if (!canPublish || !enabled) return null;

  if (loading || !data) {
    return (
      <Button size="small" disabled>
        Publish
      </Button>
    );
  }

  if (notAllowed) {
    return (
      <Tooltip content="You can't publish web recipes, only your own.">
        <Button size="small" disabled>
          Publish
        </Button>
      </Tooltip>
    );
  }

  const publishedRecipe = data.publishedRecipe;
  const isPublished = !!publishedRecipe;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="small" color={isPublished ? 'accent' : 'default'}>
          {isPublished ? 'Published' : 'Publish'}
        </Button>
      </DialogTrigger>
      {publishedRecipe ? (
        <PublishedContent
          recipe={recipe}
          publishedRecipe={publishedRecipe}
          onChange={refetch}
        />
      ) : (
        <UnpublishedContent recipe={recipe} onChange={refetch} />
      )}
    </Dialog>
  );
}

function PublishedContent({
  recipe,
  publishedRecipe: { publishedAt, url },
  onChange,
}: {
  recipe: Recipe;
  publishedRecipe: { publishedAt: string; url: string };
  onChange?: () => void;
}) {
  const { id } = hooks.useWatch(recipe);
  const [unpublish] = useMutation(unpublishMutation, {
    onCompleted: onChange,
  });

  const publishDate = new Date(publishedAt);

  return (
    <DialogContent>
      <DialogTitle>Manage publication</DialogTitle>
      <P>Published {format(publishDate, 'PPp')}</P>
      <TextLink to={url} newTab>
        View on the web
      </TextLink>
      <DialogActions>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
        <Button
          color="destructive"
          onClick={async () => {
            try {
              await unpublish({
                variables: { recipeId: id },
              });
            } catch (err) {
              console.error(err);
              toast.error('Failed to unpublish recipe');
            }
          }}
        >
          Unpublish
        </Button>
      </DialogActions>
    </DialogContent>
  );
}

function UnpublishedContent({
  recipe,
  onChange,
}: {
  recipe: Recipe;
  onChange?: () => void;
}) {
  const { id, slug } = hooks.useWatch(recipe);
  const [consent, setConsent] = useState(false);
  const [publish, { loading: publishing }] = useMutation(publishMutation, {
    onCompleted: onChange,
  });

  return (
    <DialogContent>
      <DialogTitle>Publish your recipe</DialogTitle>
      <div className="flex flex-col gap-4">
        <P>
          Published recipes can be shared with others on the web. You retain
          full rights to your recipe and can unpublish anytime
        </P>
        <div className="flex flex-row items-start gap-2">
          <Checkbox
            checked={consent}
            onCheckedChange={(c) => setConsent(c !== false)}
            id="publish-consent"
          />
          <label htmlFor="publish-consent" className="text-xs">
            I confirm that I own and have the right to publish this recipe, in
            accordance with the{' '}
            <TextLink to="https://biscuits.club/tos" newTab>
              Biscuits Terms of Service
            </TextLink>
          </label>
        </div>
      </div>
      <DialogActions>
        <DialogClose asChild>
          <Button>Cancel</Button>
        </DialogClose>
        <Button
          color="primary"
          disabled={!consent}
          loading={publishing}
          onClick={async () => {
            try {
              await publish({
                variables: {
                  input: {
                    id,
                    slug,
                  },
                },
              });
            } catch (err) {
              console.error(err);
              toast.error('Failed to publish recipe');
            }
          }}
        >
          Publish
        </Button>
      </DialogActions>
    </DialogContent>
  );
}
