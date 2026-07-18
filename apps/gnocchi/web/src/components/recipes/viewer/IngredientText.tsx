import { hooks } from '@/stores/groceries/index.js';
import { Text, Tooltip } from '@a-type/ui';
import { fractionToText } from '@a-type/utils';
import {
	RecipeIngredientsItem,
	RecipeIngredientsItemComments,
} from '@gnocchi.biscuits/verdant';
import pluralize from 'pluralize';
import { CSSProperties } from 'react';
import { TextWithMultipliedNumbers } from './TextWithMultipliedNumbers.jsx';

export interface IngredientTextProps {
	ingredient: RecipeIngredientsItem;
	multiplier: number;
	className?: string;
	style?: CSSProperties;
}

export function IngredientText({
	ingredient,
	multiplier,
	className,
	style,
}: IngredientTextProps) {
	const { text, quantity, unit, food, comments, isSectionHeader } =
		hooks.useWatch(ingredient);

	if (isSectionHeader) {
		return (
			<Text bold className={className} style={style}>
				{text}
			</Text>
		);
	}

	return (
		<IngredientTextRenderer
			text={text}
			quantity={quantity}
			unit={unit}
			food={food}
			comments={comments}
			multiplier={multiplier}
			className={className}
			style={style}
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
	style,
}: {
	text: string;
	quantity: number;
	unit: string | null;
	food: string | null;
	comments: string[] | RecipeIngredientsItemComments;
	multiplier?: number;
	className?: string;
	style?: CSSProperties;
}) {
	if (multiplier !== 1) {
		const finalQuantity = quantity * multiplier;
		const showPlural = finalQuantity !== 1;
		return (
			<span className={className} style={style}>
				<Tooltip
					content={
						(
							<Text style={{ maxWidth: '80dvw', textWrap: 'wrap' }}>
								Multiplier {multiplier}x applied. Original value: {quantity}
							</Text>
						) as any
					}
				>
					<Text
						bold
						className="@mode-accent"
						style={{ color: 'var(--m-fg-light)' }}
					>
						{fractionToText(finalQuantity)}
					</Text>
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

	return (
		<span className={className} style={style}>
			{replaceNumbersWithFractions(text)}
		</span>
	);
}

function replaceNumbersWithFractions(text: string) {
	// include decimals
	return text.replace(/(\d+\.\d+)/g, (match) =>
		fractionToText(parseFloat(match)),
	);
}
