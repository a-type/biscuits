import { Button, ButtonProps, Icon } from '@a-type/ui';
import classNames from 'classnames';
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
		<div className={classNames('flex flex-col gap-2', className)} {...rest}>
			<div className="text-xs uppercase text-gray-7 font-bold m2-1">
				{title}
			</div>
			<div className="flex flex-row gap-2 flex-wrap">
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
			color="default"
			ref={ref}
			className={classNames(
				'rounded-full font-normal border-gray-5 max-w-100% overflow-hidden text-ellipsis flex flex-row',
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
