import { Button, ButtonProps, clsx, Icon } from '@a-type/ui';
import { UseComboboxGetItemPropsOptions } from 'downshift';
import { forwardRef } from 'react';
import { SuggestionData } from './hooks.js';

export function SuggestionGroup({
	title,
	suggestions,
	className,
	getItemProps,
	...rest
}: {
	title: string;
	suggestions: SuggestionData[];
	className?: string;
	getItemProps: (opts: UseComboboxGetItemPropsOptions<SuggestionData>) => any;
}) {
	return (
		<div className={clsx('flex flex-col gap-2', className)} {...rest}>
			<div className="m2-1 text-xs font-bold uppercase color-gray-dark">
				{title}
			</div>
			<div className={clsx('flex flex-wrap gap-2')}>
				{suggestions.map((suggestion) => (
					<SuggestionItem
						key={suggestion.id}
						value={suggestion}
						{...getItemProps({ item: suggestion })}
					/>
				))}
			</div>
		</div>
	);
}

export const SuggestionItem = forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		value: SuggestionData;
	}
>(function SuggestionItem({ className, value, ...rest }, ref) {
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
			emphasis="default"
			ref={ref}
			data-index={value.index}
			className={clsx(
				'max-w-100% flex flex-row overflow-hidden text-ellipsis rounded-full font-normal border-gray',
				'[&[aria-selected="true"]]:bg-primary-wash',
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
