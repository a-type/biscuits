import PaprikaImporter from '@/components/import/PaprikaImporter.jsx';
import { TagManager } from '@/components/recipes/tags/TagManager.jsx';
import { Button, DropdownMenu, Icon } from '@a-type/ui';
import { useFeatureFlag } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
import { Suspense, useCallback, useState } from 'react';

export interface RecipeCollectionMenuProps {
	className?: string;
}

export function RecipeCollectionMenu({ className }: RecipeCollectionMenuProps) {
	const [open, setOpen] = useState(false);
	const onSubmenuClose = useCallback(() => setOpen(false), []);
	const publishEnabled = useFeatureFlag('hub');

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenu.Trigger
				render={<Button emphasis="ghost" className={className} />}
			>
				<Icon name="dots" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<Suspense>
					<DropdownMenu.Item
						onSelect={(ev) => {
							ev.preventDefault();
						}}
						render={<PaprikaImporter onClose={onSubmenuClose} />}
					>
						Import from Paprika 3
					</DropdownMenu.Item>
				</Suspense>
				<Suspense>
					<TagManager onClose={onSubmenuClose}>
						<DropdownMenu.Item onSelect={(ev) => ev.preventDefault()}>
							Edit Tags
						</DropdownMenu.Item>
					</TagManager>
				</Suspense>
				{publishEnabled && (
					<Suspense>
						<DropdownMenu.Item render={<Link to="/recipes/published" />}>
							Shared Recipes
						</DropdownMenu.Item>
					</Suspense>
				)}
			</DropdownMenu.Content>
		</DropdownMenu>
	);
}
