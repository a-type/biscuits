import { graphql, isClientError, graphqlClient } from '@biscuits/graphql';
import { showSubscriptionPromotion } from '@biscuits/client';
import { detailedInstructionsToDoc, instructionsToDoc } from '@/lib/tiptap.js';
import { BiscuitsError } from '@biscuits/error';
import { lookupUnit, parseIngredient } from '@gnocchi.biscuits/conversion';
import { RecipeInit, Client } from '@gnocchi.biscuits/verdant';
import { toast } from '@a-type/ui';

const recipeScanQuery = graphql(`
	query RecipeScan($input: RecipeScanInput!) {
		recipeScan(input: $input) {
			type
			data {
				url
				title
				url
				rawIngredients
				author
				note
				detailedIngredients {
					original
					foodName
					quantity
					unit
					comments
					note
					preparations
					isSectionHeader
				}
				steps
				detailedSteps {
					type
					content
					note
				}
				cookTimeMinutes
				prepTimeMinutes
				totalTimeMinutes
				servings
			}
		}
	}
`);

export async function getScannedRecipe(
	url: string,
	client: Client,
): Promise<RecipeInit> {
	try {
		const scanResult = await graphqlClient.query({
			query: recipeScanQuery,
			variables: {
				input: { url },
			},
		});
		let result: RecipeInit = {
			url,
			title: 'Web Recipe',
		};

		if (!scanResult.data?.recipeScan) {
			toast.error('Sorry, we had trouble finding a recipe on that webpage.');
			return result;
		}

		const scanType = scanResult.data.recipeScan.type;
		const scanned = scanResult.data.recipeScan.data;

		if (scanType === 'web') {
			if (scanned.detailedIngredients?.length) {
				result.ingredients = scanned.detailedIngredients.map((i) => {
					const unitMatch = i.unit ? lookupUnit(i.unit) : null;
					return {
						food: i.foodName,
						quantity: i.quantity,
						unit:
							unitMatch?.singular?.toLowerCase() || i.unit?.toLowerCase() || '',
						comments: [...(i.comments ?? [])],
						text: i.original,
						note: i.note,
						isSectionHeader: i.isSectionHeader ?? undefined,
					};
				});
			} else if (scanned.rawIngredients?.length) {
				result.ingredients = scanned.rawIngredients.map((line: string) => {
					const parsed = parseIngredient(line);
					return {
						text: parsed.sanitized,
						food: parsed.food,
						unit: parsed.unit,
						comments: parsed.comments,
						quantity: parsed.quantity,
					};
				});
			}

			// lookup foods for all ingredients
			result.ingredients = await Promise.all(
				(result.ingredients ?? []).map(async (ingredient) => {
					try {
						if (!ingredient.food) return ingredient;

						const lookup = await client.foods.findOne({
							index: {
								where: 'nameLookup',
								equals: ingredient.food,
							},
						}).resolved;
						// make this match a little more strict - avoids things like
						// "sugar" matching "brown sugar"
						if (
							lookup &&
							(lookup.get('canonicalName') === ingredient.food ||
								lookup.get('alternateNames').includes(ingredient.food))
						) {
							ingredient.food = lookup.get('canonicalName');
						}
						return ingredient;
					} catch (err) {
						// we tried...
						return ingredient;
					}
				}),
			);

			result.url = scanned.url;
			result.title = scanned.title || 'Web Recipe';
			result.note = scanned.note;
			result.prepTimeMinutes = scanned.prepTimeMinutes ?? undefined;
			result.cookTimeMinutes = scanned.cookTimeMinutes ?? undefined;
			result.totalTimeMinutes = scanned.totalTimeMinutes ?? undefined;
			result.instructions = scanned.detailedSteps
				? detailedInstructionsToDoc(scanned.detailedSteps as any)
				: instructionsToDoc(scanned.steps || []);
			result.servings = scanned.servings ?? undefined;
		} else {
			throw new Error('Unrecognized scan result type');
		}

		return result;
	} catch (err) {
		console.error(err);
		if (
			err instanceof Error &&
			isClientError(err) &&
			err.graphQLErrors.some(
				(e) => e.extensions?.code === BiscuitsError.Code.Forbidden,
			)
		) {
			showSubscriptionPromotion();
		} else {
			toast.error('Could not scan that recipe.');
		}
		throw err;
	}
}
