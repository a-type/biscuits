import { hooks } from '@/stores/groceries/index.js';
import { Tooltip } from '@a-type/ui';
import { fractionToText } from '@a-type/utils';
import {
	RecipeIngredientsItem,
	RecipeIngredientsItemComments,
} from '@gnocchi.biscuits/verdant';
import pluralize from 'pluralize';
import { TextWithMultipliedNumbers } from './TextWithMultipliedNumbers.jsx';

export interface IngredientTextProps {
	ingredient: RecipeIngredientsItem;
	multiplier: number;
	className?: string;
}

export function IngredientText({
	ingredient,
	multiplier,
	className,
}: IngredientTextProps) {
	const { text, quantity, unit, food, comments } = hooks.useWatch(ingredient);

	return (
		<IngredientTextRenderer
			text={text}
			quantity={quantity}
			unit={unit}
			food={food}
			comments={comments}
			multiplier={multiplier}
			className={className}
		/>
	);
}

export function IngredientTextRenderer({
	text,
	quantity,
	unit,
	food,
	comments,
	multiplier = 1,
	className,
}: {
	text: string;
	quantity: number;
	unit: string | null;
	food: string | null;
	comments: string[] | RecipeIngredientsItemComments;
	multiplier?: number;
	className?: string;
}) {
	if (multiplier !== 1) {
		const finalQuantity = quantity * multiplier;
		const showPlural = finalQuantity !== 1;
		return (
			<span className={className}>
				<Tooltip
					content={
						(
							<span className="text-wrap max-w-80dvw">
								Multiplier {multiplier}x applied. Original value: {quantity}
							</span>
						) as any
					}
				>
					<span className="color-accent-dark font-bold">
						{fractionToText(finalQuantity)}
					</span>
				</Tooltip>{' '}
				<span className="unit">
					{unit ? (showPlural ? pluralize(unit) : unit) : ''}
				</span>{' '}
				<TextWithMultipliedNumbers
					text={showPlural && !unit ? pluralize(food || '') : food}
					multiplier={multiplier}
				/>
				<TextWithMultipliedNumbers
					text={
						comments.length > 0
							? `,
				${comments.map((comment) => comment).join(', ')}`
							: ''
					}
					multiplier={multiplier}
				/>
			</span>
		);
	}

	return <span className={className}>{replaceNumbersWithFractions(text)}</span>;
}

function replaceNumbersWithFractions(text: string) {
	// include decimals
	return text.replace(/(\d+\.\d+)/g, (match) =>
		fractionToText(parseFloat(match)),
	);
}
