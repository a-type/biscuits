import { useRecipeTitleFilter } from '@/components/recipes/collection/hooks.js';
import { Button, Icon, LiveUpdateTextField } from '@a-type/ui';
import classNames from 'classnames';

export function RecipeSearchBar({
	className,
	...props
}: {
	className?: string;
}) {
	const [value, setValue] = useRecipeTitleFilter();

	return (
		<div className={classNames('flex flex-row gap-3', className)}>
			<LiveUpdateTextField
				placeholder="Search recipes"
				value={value}
				onChange={setValue}
				className="flex-1 rounded-full"
				autoSelect
				{...props}
			/>
			{!!value && (
				<Button emphasis="ghost" onClick={() => setValue('')}>
					<Icon name="x" />
				</Button>
			)}
		</div>
	);
}
