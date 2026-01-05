import { hooks } from '@/stores/groceries/index.js';
import { Button, Card, Chip, Dialog, Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import pluralize from 'pluralize';
import { RecipeListItem } from '../collection/RecipeListItem.jsx';

export interface RecipeCopiesTagProps {
	recipe: Recipe;
}

export function RecipeCopiesTag({ recipe }: RecipeCopiesTagProps) {
	const { id, title } = hooks.useWatch(recipe);
	const copies = hooks.useAllRecipes({
		index: {
			where: 'copyOf',
			equals: id,
		},
	});

	if (copies.length === 0) {
		return null;
	}

	return (
		<Dialog>
			<Dialog.Trigger
				render={
					<Chip
						render={
							<Button
								size="small"
								emphasis="default"
								className="font-normal shadow-none"
							>
								{copies.length} {pluralize('copy', copies.length)}{' '}
								<Icon name="new_window" />
							</Button>
						}
					/>
				}
			/>

			<Dialog.Content>
				<Dialog.Title>Copies of {title}</Dialog.Title>

				<Card.Grid>
					{copies.map((copy) => (
						<RecipeListItem key={copy.get('id')} recipe={copy} />
					))}
				</Card.Grid>
				<Dialog.Actions>
					<Dialog.Close>Close</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
