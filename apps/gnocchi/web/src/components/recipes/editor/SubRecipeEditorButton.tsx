import { hooks } from '@/stores/groceries/index.js';
import { Box, Button, Dialog, FieldLabel, Icon, Text } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { MultiplierStepper } from '../viewer/MultiplierStepper.jsx';

export function SubRecipeEditorButton({
	parentRecipe,
	subRecipeId,
}: {
	parentRecipe: Recipe;
	subRecipeId: string;
}) {
	const { subRecipeMultipliers, instructions } = hooks.useWatch(parentRecipe);
	hooks.useWatch(subRecipeMultipliers);

	const setMultiplier = (val: number) => {
		subRecipeMultipliers.set(subRecipeId, val);
	};

	function removeStepWithRecipe() {
		const steps = instructions.get('content');
		const step = steps?.find((step) => {
			return step?.get('attrs')?.get('subRecipeId') === subRecipeId;
		});
		if (step) {
			steps?.removeAll(step);
		}
	}

	return (
		<Dialog>
			<Dialog.Trigger render={<Button emphasis="ghost" />}>
				<Icon name="dots" />
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Edit sub-recipe</Dialog.Title>
				<Box col gap="md">
					<FieldLabel>Sub-recipe multiplier</FieldLabel>
					<MultiplierStepper
						onChange={setMultiplier}
						value={subRecipeMultipliers.get(subRecipeId) || 1}
						highlightChange
					/>
					<Text emphasis="ambient" dim>
						This applies a multiplier to the entire sub-recipe in addition to
						any multiplier on the parent recipe.
					</Text>
				</Box>
				<Dialog.Actions className="justify-between">
					<Button
						emphasis="primary"
						color="attention"
						onClick={removeStepWithRecipe}
					>
						Remove this sub-recipe
					</Button>
					<Dialog.Close>Done</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
