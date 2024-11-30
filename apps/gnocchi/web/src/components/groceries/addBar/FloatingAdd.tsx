import { AddPane } from '@/components/addBar/AddPane.jsx';
import { useKeepOpenAfterSelect } from '@/components/addBar/hooks.js';
import { Icon } from '@/components/icons/Icon.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@a-type/ui';
import { useOnPointerDownOutside } from '@biscuits/client';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import './FloatingAdd.css';

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
			});
			if (!keepOpenOnSelect) {
				setOpen(false);
			}
		},
		[listId, addItems, keepOpenOnSelect],
	);

	const ref = useOnPointerDownOutside(() => {
		setOpen(false);
	});

	const [disableAnimation, setDisableAnimation] = useState(true);
	if (disableAnimation && open) {
		setDisableAnimation(false);
	}

	return (
		<div
			className={classNames(
				'relative flex flex-col items-stretch justify-stretch w-full z-100',
				'floating-add',
				// only visible on mobile
				'md:hidden',
				className,
			)}
			ref={ref}
		>
			<AddPane
				onAdd={onAdd}
				showRichSuggestions
				className={classNames(
					'relative z-1 shadow-xl',
					'add-bar',
					open
						? 'add-bar-visible pointer-events-auto'
						: 'add-bar-hidden pointer-events-none',
					disableAnimation && 'disable-animation',
				)}
				onOpenChange={setOpen}
				disabled={!open}
				{...rest}
			/>
			<Button
				size="icon"
				onClick={() => setOpen(true)}
				color="primary"
				className={classNames(
					'absolute shadow-xl bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-auto',
					'add-button',
					open ? 'hidden' : 'visible',
				)}
			>
				<Icon name="plus" className="w-20px h-20px" />
			</Button>
		</div>
	);
}
