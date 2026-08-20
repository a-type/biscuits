import { Box, Button, clsx, Icon, Img, Lightbox } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useStepImage } from './hooks.js';
import cls from './StepImage.module.css';

export interface StepImageProps {
	stepId: string;
	recipe: Recipe;
	className?: string;
}

export function StepImage({ stepId, recipe, className }: StepImageProps) {
	const { stepImage, setStepImage } = useStepImage(stepId, recipe);

	if (!stepImage?.url) {
		return null;
	}

	return (
		<Box className={clsx(cls.root, className)} round overflow="clip">
			<Lightbox>
				<Img src={stepImage.url} alt="Step Image" className={cls.image} />
			</Lightbox>
			<Button
				aria-label="Remove image"
				className={cls.clear}
				onClick={() => setStepImage(null)}
				emphasis="ghost"
				size="small"
			>
				<Icon name="x" />
			</Button>
		</Box>
	);
}
