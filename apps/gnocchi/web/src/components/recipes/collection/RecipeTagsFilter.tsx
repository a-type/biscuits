import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button, HorizontalList, Icon } from '@a-type/ui';
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
					<Button
						size="small"
						emphasis="light"
						toggled={!!selectedValues?.includes(tag.get('name'))}
						toggleMode="indicator"
						onClick={() => onSelect(tag.get('name'))}
						className={classNames(
							'my-auto min-h-24px py-1 px-2 text-xs',
							tag.get('color') && `palette-${tag.get('color')}`,
						)}
					>
						<span>{tag.get('icon') ?? <Icon name="tag" />}</span>
						<span>{tag.get('name')}</span>
					</Button>
				</RecipeTagMenuWrapper>
			))}
		</HorizontalList>
	);
}
