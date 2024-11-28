import Paprikaimporter from '@/components/import/Paprikaimporter.jsx';
import { TagManager } from '@/components/recipes/tags/TagManager.jsx';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@a-type/ui';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Suspense, useCallback, useState } from 'react';

export interface RecipeCollectionMenuProps {
	className?: string;
}

export function RecipeCollectionMenu({ className }: RecipeCollectionMenuProps) {
	const [open, setOpen] = useState(false);
	const onSubmenuClose = useCallback(() => setOpen(false), []);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button size="icon" color="ghost" className={className}>
					<DotsVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<Suspense>
					<DropdownMenuItem
						onSelect={(ev) => {
							ev.preventDefault();
						}}
						asChild
					>
						<Paprikaimporter onClose={onSubmenuClose}>
							import from Paprika 3
						</Paprikaimporter>
					</DropdownMenuItem>
				</Suspense>
				<Suspense>
					<TagManager onClose={onSubmenuClose}>
						<DropdownMenuItem onSelect={(ev) => ev.preventDefault()}>
							Edit Tags
						</DropdownMenuItem>
					</TagManager>
				</Suspense>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
