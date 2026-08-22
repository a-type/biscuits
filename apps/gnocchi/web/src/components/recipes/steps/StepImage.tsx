import { hooks } from '@/stores/groceries/index.js';
import { Box, clsx, ImageUploader, Img, Lightbox } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useContext } from 'react';
import { useStepImage } from './hooks.js';
import { InstructionsContext } from './InstructionsContext.jsx';
import cls from './StepImage.module.css';

export interface StepImageProps {
	stepId: string;
	recipe: Recipe;
	className?: string;
}

export function StepImage({ stepId, recipe, className }: StepImageProps) {
	const { stepImage, setStepImage } = useStepImage(stepId, recipe);
	const { isEditing } = useContext(InstructionsContext);
	hooks.useWatch(stepImage);

	if (!stepImage?.url) {
		return null;
	}

	if (isEditing) {
		return (
			<ImageUploader
				value={stepImage.url}
				onChange={(v) => setStepImage(v)}
				className={clsx(cls.root, className)}
				altText={stepImage.alt ?? undefined}
				onAltText={(txt) => stepImage.setAlt(txt)}
			/>
		);
	}

	return (
		<Box className={clsx(cls.root, className)} round overflow="clip">
			<Lightbox>
				<Img
					src={stepImage.url}
					alt={stepImage.alt ?? undefined}
					className={cls.image}
				/>
			</Lightbox>
		</Box>
	);
}
