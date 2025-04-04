import PaprikaImporter from '@/components/import/PaprikaImporter.jsx';
import { TagManager } from '@/components/recipes/tags/TagManager.jsx';
import { Button, DropdownMenu } from '@a-type/ui';
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
			<DropdownMenu.Trigger asChild>
				<Button size="icon" color="ghost" className={className}>
					<DotsVerticalIcon />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<Suspense>
					<DropdownMenu.Item
						onSelect={(ev) => {
							ev.preventDefault();
						}}
						asChild
					>
						<PaprikaImporter onClose={onSubmenuClose}>
							Import from Paprika 3
						</PaprikaImporter>
					</DropdownMenu.Item>
				</Suspense>
				<Suspense>
					<TagManager onClose={onSubmenuClose}>
						<DropdownMenu.Item onSelect={(ev) => ev.preventDefault()}>
							Edit Tags
						</DropdownMenu.Item>
					</TagManager>
				</Suspense>
			</DropdownMenu.Content>
		</DropdownMenu>
	);
}
