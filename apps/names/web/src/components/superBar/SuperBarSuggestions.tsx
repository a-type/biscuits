import { hooks } from '@/hooks.js';
import { Button, ButtonProps, clsx, Icon } from '@a-type/ui';
import { Person } from '@names.biscuits/verdant';
import { forwardRef } from 'react';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarSuggestionsProps {
	className?: string;
}

export function SuperBarSuggestions({ className }: SuperBarSuggestionsProps) {
	const { groups, getMenuProps } = useSuperBar();

	if (groups.length === 0 || groups.every((g) => g.items.length === 0)) {
		return (
			<div className="p-8 col gap-6">
				<Icon name="profile" size={80} className="text-gray-5" />
				<div className="text-gray-5 text-center text-lg">No matches found</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 w-full p-4" {...getMenuProps()}>
			{groups.map((group) => (
				<SuggestionGroup
					key={group.title}
					title={group.title}
					items={group.items}
				/>
			))}
		</div>
	);
}

function SuggestionGroup({
	title,
	items,
	className,
}: {
	title: string;
	items: Person[];
	className?: string;
}) {
	const { highlightedId, inputValue, getItemProps } = useSuperBar();
	if (!items.length) {
		return null;
	}
	return (
		<div className={clsx('flex flex-col gap-2', className)}>
			<div className="text-xs uppercase text-gray-7 font-bold m2-1">
				{title}
			</div>
			<div className="flex flex-row gap-2 flex-wrap items-start">
				{items.map((suggestion, index) => (
					<SuggestionItem
						key={suggestion.get('id')}
						value={suggestion}
						highlighted={highlightedId === suggestion.get('id')}
						inputValue={inputValue}
						{...getItemProps({ item: suggestion, index })}
					/>
				))}
			</div>
		</div>
	);
}

const SuggestionItem = forwardRef<
	HTMLButtonElement,
	Omit<ButtonProps, 'value'> & {
		highlighted?: boolean;
		value: Person;
		inputValue?: string;
	}
>(function SuggestionItem({ className, value, inputValue, ...rest }, ref) {
	const { name, note } = hooks.useWatch(value);

	const matchesName =
		!inputValue ||
		name
			.toLowerCase()
			.split(/\s+/)
			.some((w) => w.startsWith(inputValue.toLowerCase()));

	if (matchesName || !note) {
		return (
			<HighlightableButton size="small" color="default" ref={ref} {...rest}>
				<Icon name="profile" /> {name}
			</HighlightableButton>
		);
	}

	const noteMatchIndex = note.toLowerCase().indexOf(inputValue.toLowerCase());
	const noteExcerpt =
		'...' +
		note.slice(noteMatchIndex - 6, noteMatchIndex + inputValue.length + 6) +
		'...';

	return (
		<HighlightableButton
			size="small"
			color="default"
			ref={ref}
			className="flex-col items-start"
			{...rest}
		>
			<div className="row">
				<Icon name="profile" /> {name}
			</div>
			<div className="row">
				<Icon name="note" /> {noteExcerpt}
			</div>
		</HighlightableButton>
	);
});

const HighlightableButton = forwardRef<
	HTMLButtonElement,
	ButtonProps & { highlighted?: boolean }
>(function HighlightableButton({ highlighted, className, ...props }, ref) {
	return (
		<Button
			{...props}
			className={clsx(
				'rounded-lg font-normal border-gray-5 max-w-100% overflow-hidden text-ellipsis flex flex-row',
				{
					'bg-primary-wash': highlighted,
				},
				className,
			)}
			ref={ref}
		/>
	);
});
