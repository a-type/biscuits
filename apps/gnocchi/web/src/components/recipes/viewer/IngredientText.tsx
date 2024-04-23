import { hooks } from '@/stores/groceries/index.js';
import { RecipeIngredientsItem } from '@gnocchi.biscuits/verdant';
import { fractionToText } from '@a-type/utils';
import pluralize from 'pluralize';
import { Tooltip } from '@a-type/ui/components/tooltip';
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

  if (multiplier !== 1) {
    const finalQuantity = quantity * multiplier;
    const showPlural = finalQuantity !== 1;
    return (
      <span className={className}>
        <Tooltip
          content={
            (
              <span className="text-wrap max-w-80vw">
                Multiplier {multiplier}x applied. Original value: {quantity}
              </span>
            ) as any
          }
        >
          <span className="text-accent-dark font-bold">
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
