import { useEditItem } from '@/components/items/hooks.js';
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

	return (
		<Box
			gap="sm"
			surface
			color="primary"
			p="sm"
			elevated="lg"
			border
			layout="center stretch"
			className={clsx('z-now-playing rounded-full', className)}
			render={
				<form
					onSubmit={(ev) => {
						ev.preventDefault();
						const isUrl = URL.canParse(value);
						const itemId = addToList(list, {
							type: isUrl ? 'link' : 'idea',
							links: isUrl ? [value] : undefined,
							description: isUrl ? undefined : value,
						});
						open(itemId);
						setValue('');
					}}
				/>
			}
		>
			<Input
				placeholders={placeholders}
				value={value}
				onValueChange={setValue}
			/>
			<Button emphasis="primary">
				<Icon name="plus" />
			</Button>
		</Box>
	);
}
