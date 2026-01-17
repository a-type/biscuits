import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import { ScrollArea, useSize } from '@a-type/ui';
import { preventDefault, stopPropagation } from '@a-type/utils';
import { useMergedRef } from '@biscuits/client';
import classNames from 'classnames';
import { Suspense, forwardRef, useEffect, useRef, useState } from 'react';
import { AddBarProps } from './AddBar.jsx';
import { AddInput } from './AddInput.jsx';
import { SuggestionGroup } from './SuggestionGroup.jsx';
import { useAddBarCombobox, useAddBarSuggestions } from './hooks.js';

const AddPaneImpl = forwardRef<
	HTMLDivElement,
	AddBarProps & {
		disabled?: boolean;
		open?: boolean;
		onOpenChange: (open: boolean) => void;
	}
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
		foodMatchSuggestions,
		recipeMatchSuggestions,
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
		getMenuProps,
		getInputProps,
		getItemProps,
		getSubmitButtonProps,
		clear,
		addingRecipe,
		clearAddingRecipe,
	} = useAddBarCombobox({
		setSuggestionPrompt,
		allSuggestions,
		onAdd: (items, focusInput) => {
			onAdd(items);
			if (focusInput) {
				inputRef.current?.focus();
			} else {
				inputRef.current?.blur();
			}
		},
		// reverse: true,
	});

	const mergedRef = useMergedRef(ref, innerRef);

	useEffect(() => {
		if (disabled) {
			inputRef.current?.blur();
		}
	}, [disabled]);

	useEffect(() => {
		if (open) {
			visualViewport?.addEventListener('scroll', preventDefault, true);
			const original = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			const pageContent = document.getElementById('page-content');
			if (pageContent) {
				pageContent.style.overflow = 'hidden';
			}
			return () => {
				visualViewport?.removeEventListener('scroll', preventDefault);
				document.body.style.overflow = original;
				if (pageContent) {
					pageContent.style.overflow = '';
				}
			};
		}
	}, [open]);

	const noSuggestions = allSuggestions.length === 0;

	// eslint-disable-next-line react-hooks/refs
	const menuProps = getMenuProps({
		ref: contentRef,
	});

	return (
		<div
			className={classNames(
				'flex flex-col-reverse border-default rounded-lg rounded-b-21px border-b-none bg-white',
				className,
			)}
		>
			<AddInput
				// eslint-disable-next-line react-hooks/refs
				inputProps={getInputProps({
					placeholder,
					ref: inputRef,
				})}
				isOpen={!!open}
				clear={() => clear()}
				ref={mergedRef}
				disableInteraction={disabled}
				submitButtonProps={getSubmitButtonProps()}
				{...rest}
			/>
			<ScrollArea
				{...menuProps}
				className={classNames(
					'max-h-[calc(var(--viewport-height,40dvh)-80px)] max-w-none w-full flex flex-col gap-4 rounded-t-lg lg:max-h-50dvh',
				)}
				onScroll={stopPropagation}
				background="white"
			>
				<div className="flex flex-col-reverse items-stretch gap-4 p-3">
					{showSuggested && (
						<SuggestionGroup
							title="Suggested"
							suggestions={mainSuggestions}
							getItemProps={getItemProps}
						/>
					)}
					{showExpiring && (
						<SuggestionGroup
							title="Expiring Soon"
							suggestions={expiresSoonSuggestions}
							getItemProps={getItemProps}
						/>
					)}
					{!noSuggestions && (
						<>
							<SuggestionGroup
								title={suggestionPrompt ? 'Matching foods' : 'Favorite foods'}
								suggestions={foodMatchSuggestions}
								getItemProps={getItemProps}
							/>
							{!!recipeMatchSuggestions.length && (
								<SuggestionGroup
									title="Matching recipes"
									suggestions={recipeMatchSuggestions}
									getItemProps={getItemProps}
								/>
							)}
						</>
					)}
					{noSuggestions && <div>No suggestions</div>}
				</div>
			</ScrollArea>
			{addingRecipe && (
				<Suspense>
					<AddToListDialog
						recipe={addingRecipe}
						onOpenChange={clearAddingRecipe}
						open
					/>
				</Suspense>
			)}
		</div>
	);
});

export const AddPane = forwardRef<
	HTMLDivElement,
	AddBarProps & {
		disabled?: boolean;
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}
>(function AddBar(props, ref) {
	return (
		<Suspense>
			<AddPaneImpl {...props} ref={ref} />
		</Suspense>
	);
});
