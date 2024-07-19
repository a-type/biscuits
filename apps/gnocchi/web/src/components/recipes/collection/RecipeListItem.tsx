import { Link } from '@/components/nav/Link.jsx';
import { RecipeEditTags } from '@/components/recipes/editor/RecipeAddTag.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Button } from '@a-type/ui/components/button';
import {
  CardActions,
  CardFooter,
  CardImage,
  CardMain,
  CardMenu,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemRightSlot,
  DropdownMenuTrigger,
} from '@a-type/ui/components/dropdownMenu';
import { Suspense, useCallback, useState } from 'react';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import { Icon } from '@a-type/ui/components/icon';
import addWeeks from 'date-fns/addWeeks';
import { PinIcon } from './PinIcon.jsx';
import { useGridStyle } from './hooks.js';
import classNames from 'classnames';
import { DrawingPinFilledIcon } from '@radix-ui/react-icons';
import { useNavigate } from '@verdant-web/react-router';
import cuid from 'cuid';

const THREE_WEEKS_AGO = addWeeks(Date.now(), -3).getTime();

export function RecipeListItem({
  recipe,
  className,
}: {
  recipe: Recipe;
  className?: string;
}) {
  const { title, pinnedAt, mainImage } = hooks.useWatch(recipe);
  const [gridStyle] = useGridStyle();

  const isPinned = !!pinnedAt && pinnedAt > THREE_WEEKS_AGO;

  const togglePinned = useCallback(() => {
    if (isPinned) {
      recipe.set('pinnedAt', null);
    } else {
      recipe.set('pinnedAt', Date.now());
    }
  }, [recipe, isPinned]);

  return (
    <CardRoot
      className={classNames(
        'self-end',
        {
          '!max-h-20vh': gridStyle === 'card-small',
          'min-h-200px md:(h-30vh max-h-300px)': !!mainImage,
        },
        'shadow-sm',
        className,
      )}
    >
      <CardMain asChild>
        <Link to={makeRecipeLink(recipe)} preserveQuery>
          <CardTitle
            className={classNames(
              'flex-shrink-0',
              gridStyle === 'card-small' ? 'text-sm sm:text-md' : '',
            )}
          >
            <span className="line-clamp-2 text-ellipsis">{title}</span>
          </CardTitle>
          <div className="m-2">
            <Suspense>
              <RecipeTagsViewer
                recipe={recipe}
                className={gridStyle === 'card-small' ? 'text-xxs' : 'text-xs'}
              />
            </Suspense>
          </div>
        </Link>
      </CardMain>
      <CardImage>
        <RecipeMainImageViewer recipe={recipe} className="w-full h-full" />
      </CardImage>
      <CardFooter>
        <CardActions>
          <Button
            size="icon"
            color={isPinned ? 'primary' : 'default'}
            onClick={togglePinned}
            className="relative"
          >
            <PinIcon isPinned={isPinned} />
          </Button>

          <AddToListButton recipe={recipe} color="ghost" size="small">
            <Icon name="add_to_list" />
          </AddToListButton>
        </CardActions>
        <CardMenu>
          <RecipeListItemMenu recipe={recipe} />
        </CardMenu>
      </CardFooter>
    </CardRoot>
  );
}

export function RecipePlaceholderItem({ className }: { className?: string }) {
  return <CardRoot className={className}>&nbsp;</CardRoot>;
}

export function RecipeListItemMenu({
  recipe,
  ...rest
}: {
  recipe: Recipe;
  className?: string;
}) {
  const deleteRecipe = hooks.useDeleteRecipe();
  const { pinnedAt } = hooks.useWatch(recipe);
  const isPinned = pinnedAt && pinnedAt > THREE_WEEKS_AGO;
  const client = hooks.useClient();
  const navigate = useNavigate();
  const copyRecipe = async () => {
    const copy = await client.recipes.clone(recipe);
    copy.update({
      slug: cuid.slug(),
      title: `${recipe.get('title')} (copy)`,
      pinnedAt: null,
      createdAt: Date.now(),
      addIntervalGuess: null,
      cookCount: 0,
      lastAddedAt: null,
      lastCookedAt: null,
      session: null,
      updatedAt: Date.now(),
    });
    navigate(makeRecipeLink(copy, '/edit'), {
      skipTransition: true,
    });
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <DropdownMenu
      open={menuOpen}
      onOpenChange={(open) => {
        if (open) setMenuOpen(true);
      }}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button size="icon" color="ghost" {...rest}>
          <Icon name="dots" className="w-20px h-20px" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onPointerDownOutside={() => setMenuOpen(false)}>
        <RecipeEditTags recipe={recipe} onClose={() => setMenuOpen(false)}>
          <DropdownMenuItem>
            <span>Tags</span>
            <DropdownMenuItemRightSlot>
              <Icon name="tag" />
            </DropdownMenuItemRightSlot>
          </DropdownMenuItem>
        </RecipeEditTags>
        <DropdownMenuItem asChild>
          <Link to={makeRecipeLink(recipe, '/edit')} preserveQuery>
            <span>Edit</span>
            <DropdownMenuItemRightSlot>
              <Icon name="pencil" />
            </DropdownMenuItemRightSlot>
          </Link>
        </DropdownMenuItem>
        {isPinned && (
          <DropdownMenuItem
            onSelect={() => {
              recipe.set('pinnedAt', null);
              setMenuOpen(false);
            }}
          >
            <span>Remove pin</span>
            <DropdownMenuItemRightSlot>
              <DrawingPinFilledIcon />
            </DropdownMenuItemRightSlot>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={copyRecipe}>
          <span>Make a copy</span>
          <DropdownMenuItemRightSlot>
            <Icon name="copy" />
          </DropdownMenuItemRightSlot>
        </DropdownMenuItem>
        <DropdownMenuItem
          color="destructive"
          onSelect={() => {
            deleteRecipe(recipe.get('id'));
            setMenuOpen(false);
          }}
        >
          <span>Delete</span>
          <DropdownMenuItemRightSlot>
            <Icon name="trash" />
          </DropdownMenuItemRightSlot>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
