import { AddPane } from '@/components/addBar/AddPane.jsx';
import { useKeepOpenAfterSelect } from '@/components/addBar/hooks.js';
import { Icon } from '@/components/icons/Icon.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@a-type/ui';
import { MenuDisclose } from '@biscuits/client';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

export interface FloatingAddProps {
	className?: string;
}

export function FloatingAdd({ className, ...rest }: FloatingAddProps) {
	const listId = useListId() || null;
	const addItems = hooks.useAddItems();
	const [open, setOpen] = useState(false);

	const [keepOpenOnSelect] = useKeepOpenAfterSelect();
	const onAdd = useCallback(
		async (items: string[]) => {
			await addItems(items, {
				listId,
				showToast: true,
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
				'relative flex flex-col items-stretch justify-stretch w-full z-100',
				// only visible on mobile
				'md:hidden',
				className,
			)}
			open={open}
			onOpenChange={setOpen}
		>
			<MenuDisclose.Content asChild>
				<AddPane
					onAdd={onAdd}
					showRichSuggestions
					className={classNames('relative z-1')}
					onOpenChange={setOpen}
					open={open}
					disabled={!open}
					{...rest}
				/>
			</MenuDisclose.Content>
			<MenuDisclose.Trigger asChild>
				<Button
					size="icon"
					onClick={() => setOpen(true)}
					color="primary"
					className={classNames('absolute shadow-xl')}
				>
					<Icon name="plus" className="w-20px h-20px" />
				</Button>
			</MenuDisclose.Trigger>
		</MenuDisclose>
	);
}
