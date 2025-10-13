import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor.jsx';
import { Route } from '@/routes/recipes/$slug/edit.jsx';

export interface RecipeEditPageProps {}

export function RecipeEditPage({}: RecipeEditPageProps) {
	const { slug } = Route.useParams();

	return <RecipeEditor slug={slug as string} />;
}

export default RecipeEditPage;
