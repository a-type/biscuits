import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button, ButtonProps, HorizontalList, Icon } from '@a-type/ui';
import classNames from 'classnames';
import { forwardRef } from 'react';

export function RecipeTagsFilter({
	onSelect,
	selectedValues = [],
	className,
	buttonClassName,
}: {
	onSelect: (name: string | null) => void;
	selectedValues?: string[] | null;
	className?: string;
	buttonClassName?: string;
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
					<TagButtonBase
						toggled={!!selectedValues?.includes(tag.get('name'))}
						onClick={() => onSelect(tag.get('name'))}
						className={classNames(
							'my-auto',
							tag.get('color') && `theme-${tag.get('color')}`,
							buttonClassName,
						)}
					>
						<span>{tag.get('icon') ?? <Icon name="tag" />}</span>
						<span>{tag.get('name')}</span>
					</TagButtonBase>
				</RecipeTagMenuWrapper>
			))}
		</HorizontalList>
	);
}

const TagButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(
	function TagButtonBase({ className, ...props }, ref) {
		return (
			<Button
				ref={ref}
				size="small"
				emphasis="primary"
				{...props}
				className={classNames(
					'flex items-center gap-1 [font-weight:inherit] [font-size:inherit]',
					className,
				)}
			/>
		);
	},
);
