import { recipeSavePromptState } from '@/components/recipes/savePrompt/state.js';
import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { Input } from '@a-type/ui/components/input';
import { useSize } from '@a-type/ui/hooks';
import { isUrl } from '@a-type/utils';
import { showSubscriptionPromotion, useCanSync } from '@biscuits/client';
import { Recipe } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import {
  UseComboboxState,
  UseComboboxStateChangeOptions,
  useCombobox,
} from 'downshift';
import {
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { AddInput } from './AddInput.jsx';
import { SuggestionGroup } from './SuggestionGroup.jsx';
import {
  SuggestionData,
  suggestionToString,
  useAddBarCombobox,
  useAddBarSuggestions,
} from './hooks.js';
import { AddBarProps } from './AddBar.jsx';

function stateReducer(
  state: UseComboboxState<SuggestionData>,
  { type, changes }: UseComboboxStateChangeOptions<SuggestionData>,
) {
  if (
    changes.inputValue &&
    type === useCombobox.stateChangeTypes.InputKeyDownEnter &&
    !changes.selectedItem
  ) {
    if (isUrl(changes.inputValue)) {
      return {
        ...changes,
        selectedItem: {
          type: 'url' as const,
          url: changes.inputValue,
          id: changes.inputValue,
        } as SuggestionData,
      };
    }

    return {
      ...changes,
      selectedItem: {
        type: 'raw' as const,
        text: changes.inputValue,
        id: changes.inputValue,
      } as SuggestionData,
    };
  }
  return changes;
}

const AddPaneImpl = forwardRef<HTMLDivElement, AddBarProps>(
  function AddPaneImpl(
    {
      onAdd,
      showRichSuggestions = false,
      open,
      onOpenChange,
      className,
      ...rest
    },
    ref,
  ) {
    const [suggestionPrompt, setSuggestionPrompt] = useState('');

    const {
      allSuggestions,
      placeholder,
      expiresSoonSuggestions,
      showExpiring,
      showSuggested,
      mainSuggestions,
      matchSuggestions,
    } = useAddBarSuggestions({
      showRichSuggestions,
      suggestionPrompt,
    });

    const contentRef = useRef<HTMLDivElement>(null);
    const innerRef = useSize(({ width }) => {
      if (contentRef.current) {
        contentRef.current.style.width = width + 'px';
      }
    });

    const {
      combobox: {
        isOpen,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        inputValue,
        setInputValue,
        selectItem,
        openMenu,
      },
      addingRecipe,
      clearAddingRecipe,
      onInputPaste,
    } = useAddBarCombobox({
      setSuggestionPrompt,
      allSuggestions,
      onAdd,
      onOpenChange,
      open,
    });

    const mergedRef = useMergedRef(ref, innerRef);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (!open) {
        inputRef.current?.blur();
      }
    }, [open]);

    const noSuggestions = allSuggestions.length === 0;

    return (
      <div
        className={classNames(
          'flex flex-col-reverse rounded-lg bg-white shadow-xl border-default rounded-b-21px border-b-none',
          className,
        )}
      >
        <AddInput
          inputProps={getInputProps({
            onPaste: onInputPaste,
            onPointerDown: openMenu,
            placeholder,
            ref: inputRef,
          })}
          isOpen={isOpen}
          selectItem={selectItem}
          clear={() => setInputValue('')}
          ref={mergedRef}
          disableInteraction={!open}
          {...rest}
        />
        <div
          {...getMenuProps({
            ref: contentRef,
          })}
          className={classNames(
            'flex flex-col overflow-x-hidden overflow-y-auto overscroll-contain max-h-[calc(var(--viewport-height,40vh)-140px)] lg:max-h-50vh w-full max-w-none gap-4 p-3',
          )}
        >
          {showSuggested && (
            <SuggestionGroup
              title="Suggested"
              suggestions={mainSuggestions}
              highlightedIndex={highlightedIndex}
              getItemProps={getItemProps}
            />
          )}
          {showExpiring && (
            <SuggestionGroup
              title="Expiring Soon"
              suggestions={expiresSoonSuggestions}
              getItemProps={getItemProps}
              highlightedIndex={highlightedIndex}
            />
          )}
          {!noSuggestions && (
            <SuggestionGroup
              title={inputValue ? 'Matches' : 'Favorites'}
              suggestions={matchSuggestions}
              highlightedIndex={highlightedIndex}
              getItemProps={getItemProps}
            />
          )}
          {noSuggestions && <div>No suggestions</div>}
        </div>
        {addingRecipe && (
          <AddToListDialog
            recipe={addingRecipe}
            onOpenChange={clearAddingRecipe}
            open
          />
        )}
      </div>
    );
  },
);

export const AddPane = forwardRef<HTMLDivElement, AddBarProps>(function AddBar(
  props,
  ref,
) {
  return (
    <Suspense>
      <AddPaneImpl {...props} ref={ref} />
    </Suspense>
  );
});
