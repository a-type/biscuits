import { AddPane } from '@/components/addBar/AddPane.jsx';
import { useKeepOpenAfterSelect } from '@/components/addBar/hooks.js';
import { useListId } from '@/contexts/ListContext.jsx';
import { useAddItems } from '@/stores/groceries/mutations.js';
import { Button, Icon } from '@a-type/ui';
import { MenuDisclose } from '@biscuits/client';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

export interface FloatingAddProps {
	className?: string;
}

export function FloatingAdd({ className, ...rest }: FloatingAddProps) {
	const listId = useListId() || null;
	const addItems = useAddItems();
	const [open, setOpen] = useState(false);

	const [keepOpenOnSelect] = useKeepOpenAfterSelect();
	const onAdd = useCallback(
		async (items: string[]) => {
			await addItems(items, {
				listId,
			});
			if (!keepOpenOnSelect) {
				setOpen(false);
			}
		},
		[listId, addItems, keepOpenOnSelect],
	);

	return (
		<MenuDisclose
			className={classNames(
				'relative z-100 w-full flex flex-col items-stretch justify-stretch',
				// only visible on mobile
				'md:hidden',
				className,
			)}
			open={open}
			onOpenChange={setOpen}
		>
			<MenuDisclose.Content
				render={
					<AddPane
						onAdd={onAdd}
						showRichSuggestions
						className={classNames('relative z-1')}
						onOpenChange={setOpen}
						open={open}
						disabled={!open}
						{...rest}
					/>
				}
			/>
			<MenuDisclose.Trigger
				render={
					<Button
						onClick={() => setOpen(true)}
						emphasis="primary"
						className={classNames('absolute shadow-xl')}
					/>
				}
			>
				<Icon name="plus" className="h-20px w-20px" />
			</MenuDisclose.Trigger>
		</MenuDisclose>
	);
}
