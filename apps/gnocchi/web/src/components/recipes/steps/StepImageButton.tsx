import { hooks } from '@/stores/groceries/index.js';
import { Button, Dialog, Icon, ImageUploader, Tooltip } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useStepImage } from './hooks.js';

export interface StepImageButtonProps {
	stepId: string;
	recipe: Recipe;
}

export function StepImageButton({ stepId, recipe }: StepImageButtonProps) {
	const { stepImage, setStepImage } = useStepImage(stepId, recipe);
	hooks.useWatch(stepImage);

	if (stepImage) {
		return null;
	}

	return (
		<Dialog>
			<Tooltip content="Add an image">
				<Dialog.Trigger
					render={
						<Button aria-label="Add image" emphasis="ghost" size="small">
							<Icon name="camera" style={{ opacity: 0.8 }} />
						</Button>
					}
				/>
			</Tooltip>
			<Dialog.Content>
				<ImageUploader
					value={stepImage}
					onChange={(file) => setStepImage(file)}
					style={{ width: '100%', aspectRatio: 1 }}
				/>
			</Dialog.Content>
		</Dialog>
	);
}
