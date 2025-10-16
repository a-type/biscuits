import { useEditItem } from '@/components/items/hooks.js';
import { hooks } from '@/hooks.js';
import { Box, Button, clsx, Icon, Input } from '@a-type/ui';
import { List } from '@wish-wash.biscuits/verdant';
import { useState } from 'react';
import { addToList } from './util.js';

export interface AddBarProps {
	className?: string;
	list: List;
}

export const placeholders = [
	'Dark green shirts',
	'Anything with cats',
	'Complicated board games',
	'Books about space',
	'Painting supplies',
	'Dark chocolate',
	'Fancy pens',
];

export function AddBar({ className, list }: AddBarProps) {
	const [value, setValue] = useState('');
	const open = useEditItem();
	const { items } = hooks.useWatch(list);

	return (
		<Box
			gap="sm"
			surface="primary"
			p="sm"
			elevated="lg"
			border
			layout="center stretch"
			asChild
			className={clsx('rounded-full', className)}
		>
			<form
				onSubmit={(ev) => {
					ev.preventDefault();
					const itemId = addToList(list, {
						description: value,
					});
					open(itemId);
					setValue('');
				}}
			>
				<Input
					placeholders={placeholders}
					value={value}
					onValueChange={setValue}
				/>
				<Button color="primary">
					<Icon name="plus" />
				</Button>
			</form>
		</Box>
	);
}
