import { UseComboboxGetItemPropsOptions } from 'downshift';
import { SuggestionData } from './hooks.js';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { ButtonProps, Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';

export function SuggestionGroup({
  title,
  suggestions,
  className,
  getItemProps,
  highlightedIndex,
  ...rest
}: {
  title: string;
  suggestions: SuggestionData[];
  className?: string;
  getItemProps: (opts: UseComboboxGetItemPropsOptions<SuggestionData>) => any;
  highlightedIndex: number;
}) {
  return (
    <div className={classNames('flex flex-col gap-2', className)} {...rest}>
      <div className="text-xs uppercase text-gray-7 font-bold m2-1">
        {title}
      </div>
      <div className="flex flex-row gap-2 flex-wrap">
        {suggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion.id}
            value={suggestion}
            highlighted={highlightedIndex === suggestion.index}
            {...getItemProps({ item: suggestion, index: suggestion.index })}
          />
        ))}
      </div>
    </div>
  );
}

export const SuggestionItem = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    highlighted?: boolean;
    value: SuggestionData;
  }
>(function SuggestionItem({ highlighted, className, value, ...rest }, ref) {
  let displayString;
  if (value.type === 'raw') {
    displayString = value.text;
  } else if (value.type === 'food') {
    displayString = value.name;
  } else if (value.type === 'recipe') {
    displayString = value.recipe.get('title');
  } else {
    displayString = value.url;
  }

  return (
    <Button
      size="small"
      color="default"
      ref={ref}
      className={classNames(
        'rounded-full font-normal border-gray-5 max-w-100% overflow-hidden text-ellipsis flex flex-row',
        {
          'bg-primary-wash': highlighted,
        },
        className,
      )}
      {...rest}
    >
      {value.type === 'recipe' && <Icon name="page" />}
      {value.type === 'food' && value.ai && <Icon name="magic" />}
      <span className="flex-1 overflow-hidden text-ellipsis">
        {displayString}
      </span>
    </Button>
  );
});
