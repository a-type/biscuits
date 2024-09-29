import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { useSize } from '@a-type/ui/hooks';
import { preventDefault, stopPropagation } from '@a-type/utils';
import classNames from 'classnames';
import { Suspense, forwardRef, useEffect, useRef, useState } from 'react';
import { AddInput } from './AddInput.jsx';
import { SuggestionGroup } from './SuggestionGroup.jsx';
import { useAddBarCombobox, useAddBarSuggestions } from './hooks.js';
import { AddBarProps } from './AddBar.jsx';
import { ScrollArea } from '@a-type/ui/components/scrollArea';

const AddPaneImpl = forwardRef<
	HTMLDivElement,
	AddBarProps & { disabled?: boolean }
>(function AddPaneImpl(
	{
		onAdd,
		showRichSuggestions = false,
		open,
		onOpenChange,
		className,
		disabled,
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

	const inputRef = useRef<HTMLInputElement>(null);
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
		onAdd: (items) => {
			onAdd(items);
			inputRef.current?.blur();
		},
		onOpenChange,
		open,
	});

	const mergedRef = useMergedRef(ref, innerRef);

	useEffect(() => {
		if (disabled) {
			inputRef.current?.blur();
		} else {
			inputRef.current?.focus();
		}
	}, [disabled]);

	useEffect(() => {
		if (open) {
			visualViewport?.addEventListener('scroll', preventDefault, true);
			const original = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				visualViewport?.removeEventListener('scroll', preventDefault);
				document.body.style.overflow = original;
			};
		}
	}, [open]);

	const noSuggestions = allSuggestions.length === 0;

	const menuProps = getMenuProps({
		ref: contentRef,
	});

	return (
		<div
			className={classNames(
				'flex flex-col-reverse rounded-lg bg-white shadow-xl border-default rounded-b-21px border-b-none gap-1',
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
				disableInteraction={disabled}
				{...rest}
			/>
			<ScrollArea
				{...menuProps}
				className={classNames(
					'flex flex-col max-h-[calc(var(--viewport-height,40vh)-80px)] lg:max-h-50vh w-full max-w-none gap-4 p-3',
				)}
				onScroll={stopPropagation}
				background="white"
			>
				<div className="flex flex-col gap-4 items-stretch">
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
			</ScrollArea>
			{addingRecipe && (
				<AddToListDialog
					recipe={addingRecipe}
					onOpenChange={clearAddingRecipe}
					open
				/>
			)}
		</div>
	);
});

export const AddPane = forwardRef<
	HTMLDivElement,
	AddBarProps & { disabled?: boolean }
>(function AddBar(props, ref) {
	return (
		<Suspense>
			<AddPaneImpl {...props} ref={ref} />
		</Suspense>
	);
});
