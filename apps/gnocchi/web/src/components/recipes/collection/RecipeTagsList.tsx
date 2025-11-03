import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { IconName, PaletteName } from '@a-type/ui';
import { TagToggle } from '@biscuits/client';
import classNames from 'classnames';

export function RecipeTagsList({
	onSelect,
	selectedValues = [],
	showNone,
	omit,
	className,
	onlySelected,
	buttonClassName,
}: {
	onSelect: (name: string | null) => void;
	selectedValues?: string[] | null;
	showNone?: boolean;
	omit?: string[];
	className?: string;
	buttonClassName?: string;
	onlySelected?: boolean;
}) {
	const allTags = hooks.useAllRecipeTagMetadata();
	const filteredByOmit = allTags
		.filter((tag) => !omit?.includes(tag.get('name')))
		.filter((tag) => {
			if (onlySelected && selectedValues?.length) {
				return selectedValues.includes(tag.get('name'));
			}
			return true;
		});

	if (allTags.length === 0 && !showNone) {
		return null;
	}

	return (
		<div className={classNames('flex flex-wrap gap-1 my-1', className)}>
			{showNone && (
				<TagToggle
					toggled={!selectedValues?.length}
					onToggle={() => {
						onSelect(null);
					}}
					className={buttonClassName}
					name="none"
					icon="x"
				/>
			)}
			{filteredByOmit.map((tag) => (
				<RecipeTagMenuWrapper tagName={tag.get('name')} key={tag.get('name')}>
					<TagToggle
						toggled={!!selectedValues?.includes(tag.get('name'))}
						onToggle={() => onSelect(tag.get('name'))}
						className={buttonClassName}
						color={tag.get('color') as PaletteName | undefined}
						icon={tag.get('icon') as IconName | undefined}
						name={tag.get('name')}
					/>
				</RecipeTagMenuWrapper>
			))}
		</div>
	);
}
