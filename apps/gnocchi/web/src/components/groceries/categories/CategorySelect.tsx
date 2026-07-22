import { hooks } from '@/stores/groceries/index.js';
import { Button, Dialog, DialogContent, DialogSelectItem } from '@a-type/ui';
import { Category } from '@gnocchi.biscuits/verdant';
import { ReactElement, useCallback, useState } from 'react';
import { withSuspense } from '../../../hocs/withSuspense.jsx';
import { NewCategoryForm } from '../NewCategoryForm.js';

export const CategorySelect = withSuspense(function CategorySelect({
	value,
	onChange,
	children,
	...rest
}: {
	value: string | null;
	onChange: (v: string | null) => void;
	children?: ReactElement;
	className?: string;
}) {
	const [open, onOpenChange] = useState(false);
	const [state, setState] = useState<'idle' | 'create'>('idle');

	const categories = hooks.useAllCategories({
		index: {
			where: 'sortKey',
			order: 'asc',
		},
	});

	const selectCategory = useCallback(
		(incomingValue: string | null) => {
			const realValue = incomingValue === 'null' ? null : incomingValue;
			if (realValue === value) return;

			if (realValue === null) {
				onChange(null);
			} else if (realValue === 'new') {
				setState('create');
			} else {
				onChange(realValue);
			}
			// onOpenChange(false);
		},
		[onChange, value],
	);

	const onCreateCategory = (category: Category) => {
		selectCategory(category?.get('id'));
		setState('idle');
	};

	const category = categories.find((c) => c.get('id') === value) ?? null;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<Dialog.SelectTrigger render={children} {...rest}>
					{category?.get('name') || 'Uncategorized'}
				</Dialog.SelectTrigger>
				<Dialog.Content>
					<Dialog.SelectList
						style={{ marginBottom: 16 }}
						value={value || 'null'}
						onValueChange={selectCategory as any}
					>
						{categories.map((category) => (
							<Dialog.SelectItem
								key={category.get('id')}
								value={category.get('id')}
							>
								{category.get('name')}
							</Dialog.SelectItem>
						))}
						<DialogSelectItem value="null">Uncategorized</DialogSelectItem>
					</Dialog.SelectList>

					<Dialog.Actions style={{ justifyContent: 'space-between' }}>
						<Button emphasis="ghost" onClick={() => setState('create')}>
							New category
						</Button>
						<Dialog.Close />
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
			<CreateCategory
				onCreate={onCreateCategory}
				open={state === 'create'}
				onOpenChange={(v) => {
					if (!v) setState('idle');
				}}
			/>
		</>
	);
});

function CreateCategory({
	onCreate,
	...rest
}: {
	onCreate: (category: Category) => void;
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	return (
		<Dialog {...rest}>
			<DialogContent>
				<NewCategoryForm onDone={onCreate} autoFocus />
			</DialogContent>
		</Dialog>
	);
}
