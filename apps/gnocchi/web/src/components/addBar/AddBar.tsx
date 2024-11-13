import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { Input } from '@a-type/ui/components/input';
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
} from '@a-type/ui/components/popover';
import { useSize } from '@a-type/ui/hooks';
import { preventDefault, stopPropagation } from '@a-type/utils';
import classNames from 'classnames';
import { Suspense, forwardRef, useRef, useState } from 'react';
import { AddInput } from './AddInput.jsx';
import { SuggestionGroup } from './SuggestionGroup.jsx';
import { useAddBarCombobox, useAddBarSuggestions } from './hooks.js';

export interface AddBarProps {
	className?: string;
	onAdd: (text: string[]) => Promise<void> | void;
	showRichSuggestions?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const AddBarImpl = forwardRef<HTMLDivElement, AddBarProps>(
	function AddBarImpl(
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

		const noSuggestions = allSuggestions.length === 0;

		return (
			<>
				<Popover open={isOpen}>
					<PopoverAnchor asChild>
						<AddInput
							inputProps={getInputProps({
								onPaste: onInputPaste,
								placeholder,
							})}
							isOpen={isOpen}
							className={className}
							selectItem={selectItem}
							clear={() => setInputValue('')}
							ref={mergedRef}
							{...rest}
						/>
					</PopoverAnchor>
					<PopoverContent
						forceMount
						disableBlur
						radius="md"
						align="start"
						sideOffset={12}
						onOpenAutoFocus={preventDefault}
						{...getMenuProps({
							ref: contentRef,
						})}
						className={classNames(
							'overflow-x-hidden overflow-y-auto overscroll-contain max-h-[calc(var(--viewport-height,40dvh)-140px)] lg:max-h-50dvh rounded-lg w-full max-w-none gap-4 p-3',
							'shadow-xl',
						)}
						onPointerDown={stopPropagation}
						onPointerMove={stopPropagation}
						onPointerUp={stopPropagation}
						onScroll={stopPropagation}
						onTouchStart={stopPropagation}
						onTouchMove={stopPropagation}
						onTouchEnd={stopPropagation}
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
					</PopoverContent>
				</Popover>
				{addingRecipe && (
					<AddToListDialog
						recipe={addingRecipe}
						onOpenChange={clearAddingRecipe}
						open
					/>
				)}
			</>
		);
	},
);

export const AddBar = forwardRef<HTMLDivElement, AddBarProps>(function AddBar(
	props,
	ref,
) {
	return (
		<Suspense fallback={<Skeleton className={props.className} />}>
			<AddBarImpl {...props} ref={ref} />
		</Suspense>
	);
});

function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={classNames(
				'layer-components:(flex flex-1 w-full flex-row gap-2)',
				className,
			)}
		>
			<Input
				data-test="grocery-list-add-input"
				name="text"
				required
				disabled
				className="flex-1 rounded-full"
				autoComplete="off"
				placeholder="Loading..."
			/>
		</div>
	);
}
