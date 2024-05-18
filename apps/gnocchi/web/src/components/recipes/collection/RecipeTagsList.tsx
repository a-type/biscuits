import { Icon } from '@/components/icons/Icon.jsx';
import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import classNames from 'classnames';
import { forwardRef } from 'react';

export function RecipeTagsList({
  onSelect,
  selectedValues = [],
  showNone,
  omit,
  className,
  onlySelected,
  buttonClassName,
}: {
  onSelect: (name: string | null) => void;
  selectedValues?: string[] | null;
  showNone?: boolean;
  omit?: string[];
  className?: string;
  buttonClassName?: string;
  onlySelected?: boolean;
}) {
  const allTags = hooks.useAllRecipeTagMetadata();
  const filteredByOmit = allTags
    .filter((tag) => !omit?.includes(tag.get('name')))
    .filter((tag) => {
      if (onlySelected && selectedValues?.length) {
        return selectedValues.includes(tag.get('name'));
      }
      return true;
    });

  if (allTags.length === 0 && !showNone) {
    return null;
  }

  return (
    <div className={classNames('flex flex-wrap gap-1 my-1', className)}>
      {showNone && (
        <TagButtonBase
          toggled={!selectedValues?.length}
          onClick={() => {
            onSelect(null);
          }}
          className={buttonClassName}
        >
          None
        </TagButtonBase>
      )}
      {filteredByOmit.map((tag) => (
        <RecipeTagMenuWrapper tagName={tag.get('name')} key={tag.get('name')}>
          <TagButtonBase
            toggled={!!selectedValues?.includes(tag.get('name'))}
            onClick={() => onSelect(tag.get('name'))}
            className={classNames(
              tag.get('color') && `theme-${tag.get('color')}`,
              buttonClassName,
            )}
          >
            <span>{tag.get('icon') ?? <Icon name="tag" />}</span>
            <span>{tag.get('name')}</span>
          </TagButtonBase>
        </RecipeTagMenuWrapper>
      ))}
    </div>
  );
}

const TagButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(
  function TagButtonBase({ className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        size="small"
        color="primary"
        {...props}
        className={classNames(
          'flex items-center gap-1 [font-weight:inherit] [font-size:inherit]',
          className,
        )}
      />
    );
  },
);
