import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { ScrollArea, useSize } from '@a-type/ui';
import { preventDefault, stopPropagation } from '@a-type/utils';
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

	const menuProps = getMenuProps({
		ref: contentRef,
	});

	return (
		<div
			className={classNames(
				'flex flex-col-reverse rounded-lg bg-white border-default rounded-b-21px border-b-none',
				className,
			)}
		>
			<AddInput
				inputProps={getInputProps({
					placeholder,
					ref: inputRef,
				})}
				isOpen={!!open}
				clear={() => clear()}
				ref={mergedRef}
				disableInteraction={disabled}
				getSubmitButtonProps={getSubmitButtonProps}
				{...rest}
			/>
			<ScrollArea
				{...menuProps}
				className={classNames(
					'flex flex-col max-h-[calc(var(--viewport-height,40dvh)-80px)] lg:max-h-50dvh w-full max-w-none gap-4',
				)}
				onScroll={stopPropagation}
				background="white"
			>
				<div className="flex flex-col gap-4 items-stretch p-3">
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
						<SuggestionGroup
							title={suggestionPrompt ? 'Matches' : 'Favorites'}
							suggestions={matchSuggestions}
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
