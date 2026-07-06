import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button, Chip, HorizontalList, Icon } from '@a-type/ui';
import classNames from 'classnames';

export function RecipeTagsFilter({
	onSelect,
	selectedValues = [],
	className,
}: {
	onSelect: (name: string | null) => void;
	selectedValues?: string[] | null;
	className?: string;
}) {
	const allTags = hooks.useAllRecipeTagMetadata({
		key: 'allRecipeTags',
	});
	const filteredByOmit = allTags.filter((tag) => {
		if (selectedValues?.length) {
			return selectedValues.includes(tag.get('name'));
		}
		return true;
	});

	if (allTags.length === 0) {
		return null;
	}

	return (
		<HorizontalList className={className}>
			{filteredByOmit.map((tag) => (
				<RecipeTagMenuWrapper tagName={tag.get('name')} key={tag.get('name')}>
					<Chip
						render={
							<Button
								size="small"
								toggled={!!selectedValues?.includes(tag.get('name'))}
								toggleMode="indicator"
							/>
						}
						emphasis="primary"
						onClick={() => onSelect(tag.get('name'))}
						className={classNames(
							tag.get('color') && `@mode-${tag.get('color')}`,
						)}
						style={{ minHeight: 24 }}
					>
						<span>{tag.get('icon') ?? <Icon name="tag" />}</span>
						<span>{tag.get('name')}</span>
					</Chip>
				</RecipeTagMenuWrapper>
			))}
		</HorizontalList>
	);
}
