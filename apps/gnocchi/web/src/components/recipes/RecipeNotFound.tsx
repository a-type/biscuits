import { LinkButton } from '@/components/nav/Link.jsx';
import { Box, H1, P } from '@a-type/ui';

export interface RecipeNotFoundProps {}

export function RecipeNotFound({}: RecipeNotFoundProps) {
	return (
		<Box col items="start" gap="lg">
			<H1>Recipe not found</H1>
			<P>Perhaps it was deleted, or you typed the URL incorrectly.</P>
			<Box>
				<LinkButton to="/recipes">Go back to recipes</LinkButton>
			</Box>
		</Box>
	);
}
