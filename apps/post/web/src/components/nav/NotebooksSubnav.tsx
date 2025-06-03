import { hooks } from '@/hooks.js';
import { Box, clsx, CollapsibleSimple, NavBar } from '@a-type/ui';
import { Notebook } from '@post.biscuits/verdant';
import { Link, useOnLocationChange } from '@verdant-web/react-router';
import { useState } from 'react';

export interface NotebooksSubnavProps {
	open: boolean;
	className?: string;
}

export function NotebooksSubnav({ open, className }: NotebooksSubnavProps) {
	const notebooks = hooks.useAllNotebooks();
	return (
		<CollapsibleSimple
			open={open}
			className={clsx('w-full min-w-200px', className)}
		>
			<Box p="xs" surface d="col" gap="xs" items="stretch" full="width">
				{notebooks.map((notebook) => (
					<NotebookSubnavItem key={notebook.get('id')} notebook={notebook} />
				))}
			</Box>
		</CollapsibleSimple>
	);
}

function NotebookSubnavItem({ notebook }: { notebook: Notebook }) {
	const { icon, name } = hooks.useWatch(notebook);
	const [path, setPath] = useState(location.pathname);
	useOnLocationChange((location) => setPath(location.pathname));
	const matches = path.startsWith(`/notebooks/${notebook.get('id')}`);

	return (
		<NavBar.Item color="neutral" asChild active={matches}>
			<Link
				to={`/notebooks/${notebook.get('id')}`}
				className="w-full overflow-hidden"
			>
				{icon?.url ?
					<img
						src={icon.url}
						className="w-[27px] h-[27px] rounded-full object-cover"
					/>
				:	<NavBar.ItemIconWrapper>
						<NavBar.ItemIcon name="page" />
					</NavBar.ItemIconWrapper>
				}
				<NavBar.ItemText className="text-sm overflow-hidden text-ellipsis">
					{name}
				</NavBar.ItemText>
			</Link>
		</NavBar.Item>
	);
}
