import { Button } from '@a-type/ui/components/button';
import { Input, InputProps } from '@a-type/ui/components/input';
import classNames from 'classnames';
import { FocusEvent, forwardRef, useCallback } from 'react';
import { Icon } from '../icons/Icon.jsx';
import { isUrl } from '@a-type/utils';
import { SuggestionData } from './hooks.js';

export interface AddInputProps {
  inputProps: InputProps;
  isOpen: boolean;
  className?: string;
  selectItem: (item: SuggestionData) => void;
  clear: () => void;
  disableInteraction?: boolean;
}

export const AddInput = forwardRef<HTMLDivElement, AddInputProps>(
  function AddInput(
    {
      inputProps,
      isOpen,
      className,
      selectItem,
      clear,
      disableInteraction,
      ...rest
    },
    ref,
  ) {
    const inputValue = inputProps.value?.toString() ?? '';
    const inputIsUrl = isUrl(inputValue);

    return (
      <div
        data-state={isOpen ? 'open' : 'closed'}
        className={classNames(
          'layer-components:(flex gap-2 flex-row w-full relative)',
          className,
        )}
        {...rest}
        ref={ref}
      >
        <Input
          data-test="grocery-list-add-input"
          name="text"
          required
          className="flex-1 pr-[72px] max-w-none"
          variant="primary"
          autoComplete="off"
          tabIndex={disableInteraction ? -1 : 0}
          {...inputProps}
          onFocus={console.log}
        />
        <div className="absolute flex flex-row-reverse gap-1 right-1 top-1">
          <Button
            data-test="grocery-list-add-button"
            color="primary"
            size="icon"
            className="w-34px h-34px p-0 items-center justify-center"
            onClick={() =>
              selectItem({
                type: 'raw',
                text: inputValue,
                id: inputValue,
              })
            }
            aria-label={inputIsUrl ? 'scan recipe page' : 'add item'}
            tabIndex={disableInteraction ? -1 : 0}
          >
            {inputIsUrl ? <Icon name="scan" /> : <Icon name="plus" />}
          </Button>
          {!!inputValue && (
            <Button
              size="icon"
              color="ghost"
              onClick={clear}
              aria-label="clear input"
              tabIndex={disableInteraction ? -1 : 0}
            >
              <Icon name="x" />
            </Button>
          )}
        </div>
      </div>
    );
  },
);
