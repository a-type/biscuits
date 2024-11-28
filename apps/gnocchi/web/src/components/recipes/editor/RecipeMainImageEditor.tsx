import { hooks } from '@/stores/groceries/index.js';
import { ImageUploader } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';

export interface RecipeMainImageEditorProps {
	recipe: Recipe;
}

export function RecipeMainImageEditor({ recipe }: RecipeMainImageEditorProps) {
	const { mainImage } = hooks.useWatch(recipe);
	hooks.useWatch(mainImage);

	return (
		<ImageUploader
			className="w-full h-full rounded-lg"
			value={mainImage?.url ?? null}
			onChange={(file) => {
				recipe.update({
					mainImage: file,
					updatedAt: Date.now(),
				});
			}}
			maxDimension={1080}
			facingMode="environment"
		/>
	);
}
