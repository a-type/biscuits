import { hooks } from '@/stores/groceries/index.js';
import { Box, Button, Dialog, FieldLabel, Icon } from '@a-type/ui';
import { ListEntity, ObjectEntity, Recipe } from '@gnocchi.biscuits/verdant';
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
		const steps = instructions.get('content') as ListEntity<
			any,
			ObjectEntity<
				any,
				{ attributes: ObjectEntity<any, { subRecipeId?: string }> }
			>[]
		>;
		const step = steps.find((step) => {
			return step?.get('attributes')?.get('subRecipeId') === subRecipeId;
		});
		if (step) {
			steps.removeAll(step);
		}
	}

	return (
		<Dialog>
			<Dialog.Trigger asChild>
				<Button size="icon" color="ghost">
					<Icon name="dots" />
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Edit sub-recipe</Dialog.Title>
				<Box direction="col" gap="md">
					<FieldLabel>Sub-recipe multiplier</FieldLabel>
					<MultiplierStepper
						onChange={setMultiplier}
						value={subRecipeMultipliers.get(subRecipeId) || 1}
						highlightChange
					/>
					<span className="text-sm color-gray-dark">
						This applies a multiplier to the entire sub-recipe in addition to
						any multiplier on the parent recipe.
					</span>
				</Box>
				<Dialog.Actions className="justify-between">
					<Button color="destructive" onClick={removeStepWithRecipe}>
						Remove this sub-recipe
					</Button>
					<Dialog.Close asChild>
						<Button>Done</Button>
					</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
