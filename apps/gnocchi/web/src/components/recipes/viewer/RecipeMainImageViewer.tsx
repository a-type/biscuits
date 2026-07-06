import { hooks } from '@/stores/groceries/index.js';
import { clsx } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import cls from './RecipeMainImageViewer.module.css';

export interface RecipeMainImageViewerProps {
	recipe: Recipe;
	className?: string;
}

export function RecipeMainImageViewer({
	recipe,
	className,
}: RecipeMainImageViewerProps) {
	const { mainImage } = hooks.useWatch(recipe);
	const src = hooks.useWatch(mainImage);

	return src ? <img src={src} className={clsx(cls.root, className)} /> : null;
}
