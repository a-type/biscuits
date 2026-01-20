import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';
import { Input, Popover, useSize } from '@a-type/ui';
import { stopPropagation } from '@a-type/utils';
import { useMergedRef } from '@biscuits/client';
import classNames from 'classnames';
import { Suspense, forwardRef, useRef, useState } from 'react';
import { AddInput } from './AddInput.jsx';
import { SuggestionGroup } from './SuggestionGroup.jsx';
import {
	useAddBarCombobox,
	useAddBarSuggestions,
	useKeepOpenAfterSelect,
} from './hooks.js';

export interface AddBarProps {
	className?: string;
	onAdd: (text: string[]) => Promise<void> | void;
	showRichSuggestions?: boolean;
}

export const AddBarImpl = forwardRef<HTMLDivElement, AddBarProps>(
	function AddBarImpl(
		{ onAdd, showRichSuggestions = false, className, ...rest },
		ref,
	) {
		const [keepOpenOnSelect] = useKeepOpenAfterSelect();
		const [open, onOpenChange] = useState(false);
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

		const {
			addingRecipe,
			clearAddingRecipe,
			getMenuProps,
			getInputProps,
			getItemProps,
			getSubmitButtonProps,
			clear,
		} = useAddBarCombobox({
			setSuggestionPrompt,
			allSuggestions,
			onAdd: (items: string[]) => {
				onAdd(items);
				if (!keepOpenOnSelect) {
					onOpenChange(false);
				}
			},
			onOpenChange,
			open,
		});

		const mergedRef = useMergedRef(ref, innerRef);

		const noSuggestions = allSuggestions.length === 0;

		const submitButtonRef = useRef<HTMLButtonElement>(null);

		return (
			<>
				<Popover open={open}>
					<AddInput
						inputProps={getInputProps({
							placeholder,
							onFocus: () => onOpenChange?.(true),
						})}
						submitButtonProps={{
							...getSubmitButtonProps(),
							ref: submitButtonRef,
						}}
						isOpen={open}
						className={className}
						clear={() => clear()}
						ref={mergedRef}
						{...rest}
					/>
					<Popover.Content
						anchor={innerRef}
						forceMount
						radius="md"
						align="start"
						side="bottom"
						sideOffset={12}
						initialFocus={false}
						finalFocus={submitButtonRef}
						// eslint-disable-next-line react-hooks/refs
						{...getMenuProps({
							ref: contentRef,
						})}
						className={classNames(
							'max-h-[calc(var(--viewport-height,40dvh)-140px)] max-w-none w-full gap-4 overflow-x-hidden overscroll-contain rounded-lg p-3 overflow-y-auto lg:max-h-50dvh',
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
					</Popover.Content>
				</Popover>
				{addingRecipe && (
					<Suspense>
						<AddToListDialog
							recipe={addingRecipe}
							onOpenChange={clearAddingRecipe}
							open
						/>
					</Suspense>
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
				'layer-components:(w-full flex flex-1 flex-row gap-2)',
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
