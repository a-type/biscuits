import { useRecipeTitleFilter } from '@/components/recipes/collection/hooks.js';
import { Button, Icon, Input } from '@a-type/ui';
import classNames from 'classnames';
import { startTransition, useState } from 'react';

export function RecipeSearchBar({
	className,
	...props
}: {
	className?: string;
}) {
	const [value, setValue] = useRecipeTitleFilter();
	const [inputValue, setInputValue] = useState(value);

	return (
		<div className={classNames('flex flex-row gap-3', className)}>
			<Input
				placeholder="Search recipes"
				value={inputValue}
				onValueChange={(v) => {
					setInputValue(v);
					startTransition(() => {
						setValue(v);
					});
				}}
				className="flex-1 rounded-full"
				autoSelect
				endAccessory={
					inputValue ? (
						<Button
							emphasis="ghost"
							onClick={() => {
								setInputValue('');
								setValue('');
							}}
						>
							<Icon name="x" />
						</Button>
					) : null
				}
				{...props}
			/>
		</div>
	);
}
