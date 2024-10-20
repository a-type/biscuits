import { hooks } from '@/stores/groceries/index.js';
import { Item } from '@gnocchi.biscuits/verdant';
import { fractionToText } from '@a-type/utils';
import pluralize from 'pluralize';

export function useItemDisplayText(item: Item) {
	const override = item.get('textOverride');
	const quantity = item.get('totalQuantity');

	if (override) {
		if (quantity === 1) return override;
		return `${fractionToText(quantity)} ${pluralize(override)}`;
	}

	const inputs = item.get('inputs');

	const pluralizedUnit = item.get('unit')
		? item.get('totalQuantity') === 1
			? item.get('unit')
			: pluralize(item.get('unit'))
		: '';
	const pluralizedName =
		item.get('totalQuantity') === 1 || item.get('unit')
			? item.get('food')
			: pluralize(item.get('food'));
	// try as much as we can to show the original text, not parsed.
	// If there's only one input and no multiplier or quantity editing
	// has happened, we can do that.
	const showOnlyInput =
		inputs.length === 1 &&
		(inputs.get(0).get('multiplier') === null ||
			inputs.get(0).get('multiplier') === 1) &&
		(inputs.get(0).get('quantity') === null ||
			inputs.get(0).get('quantity') === quantity);
	const displayString = showOnlyInput
		? `${inputs.get(0).get('text')}`
		: `${fractionToText(quantity)} ${
				pluralizedUnit && `${pluralizedUnit} `
		  }${pluralizedName}`;

	return displayString;
}
export function useItemSubline(item: Item) {
	const { comment, textOverride } = hooks.useWatch(item);
	hooks.useWatch(item.get('inputs'));
	if (comment) {
		return comment;
	}
	// items with a text override show their original as subline
	if (textOverride) {
		const firstInput = item.get('inputs').get(0);
		if (!firstInput) return undefined;
		const firstInputText =
			firstInput.get('text') +
			(firstInput.get('multiplier')
				? ` (x${firstInput.get('multiplier')})`
				: '');
		if (
			firstInputText.trim().toLowerCase() === textOverride.trim().toLowerCase()
		) {
			return undefined;
		}
		const numInputs = item.get('inputs').length;
		return firstInputText + (numInputs > 1 ? `, ...` : '');
	}
	return undefined;
}
