import { AppearWithScroll } from '@/components/recipes/cook/AppearWithScroll.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Box, ImageUploader, P, useToggle } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';

export interface AddImagePromptProps {
	recipe: Recipe;
}

export function AddImagePrompt({ recipe }: AddImagePromptProps) {
	const { mainImage } = hooks.useWatch(recipe);
	const [show] = useToggle(!mainImage);

	if (!show) {
		return null;
	}

	return (
		<AppearWithScroll>
			<Box col gap="sm">
				<P>Enjoy! Now would be a good time to add a photo to this recipe 🙂</P>
				<ImageUploader
					value={mainImage?.url || null}
					onChange={(image) => {
						recipe.update({
							mainImage: image,
							updatedAt: Date.now(),
						});
					}}
					style={{ height: 200, overflow: 'hidden' }}
					maxDimension={1080}
					facingMode="environment"
				/>
			</Box>
		</AppearWithScroll>
	);
}
