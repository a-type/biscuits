import { hooks } from '@/hooks.js';
import { Box, CollapsibleSimple, NavBar } from '@a-type/ui';
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
		<CollapsibleSimple open={open} className={className}>
			<Box p="xs" surface d="col" gap="xs">
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
			<Link to={`/notebooks/${notebook.get('id')}`}>
				{icon?.url ?
					<img src={icon.url} className="w-6 h-6 rounded-full object-cover" />
				:	<NavBar.ItemIconWrapper>
						<NavBar.ItemIcon name="page" />
					</NavBar.ItemIconWrapper>
				}
				<NavBar.ItemText className="text-sm">{name}</NavBar.ItemText>
			</Link>
		</NavBar.Item>
	);
}
