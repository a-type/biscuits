import { useRecipeTitleFilter } from '@/components/recipes/collection/hooks.js';
import { Box, Button, Icon, Input } from '@a-type/ui';
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
		<Box gap="sm" className={className}>
			<Input
				placeholder="Search recipes"
				value={inputValue}
				onValueChange={(v) => {
					setInputValue(v);
					startTransition(() => {
						setValue(v);
					});
				}}
				style={{ flex: 1 }}
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
		</Box>
	);
}
