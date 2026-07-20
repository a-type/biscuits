import PaprikaImporter from '@/components/import/PaprikaImporter.jsx';
import { TagManager } from '@/components/recipes/tags/TagManager.jsx';
import { Button, DropdownMenu, Icon } from '@a-type/ui';
import { useFeatureFlag } from '@biscuits/client';
import { Link } from '@tanstack/react-router';
import { Suspense, useState } from 'react';

export interface RecipeCollectionMenuProps {
	className?: string;
}

export function RecipeCollectionMenu({ className }: RecipeCollectionMenuProps) {
	const [open, setOpen] = useState(false);
	const publishEnabled = useFeatureFlag('hub');
	const [showPaprika, setShowPaprika] = useState(false);
	const [showTagManager, setShowTagManager] = useState(false);

	return (
		<>
			<Suspense>
				<PaprikaImporter
					open={showPaprika}
					onClose={() => setShowPaprika(false)}
				/>
				<TagManager
					open={showTagManager}
					onClose={() => setShowTagManager(false)}
				/>
			</Suspense>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenu.Trigger
					render={
						<Button
							emphasis="ghost"
							className={className}
							aria-label="Show recipe menu"
						/>
					}
				>
					<Icon name="dots" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item
						onClick={() => {
							setShowPaprika(true);
						}}
					>
						Import from Paprika 3
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onClick={() => {
							setShowTagManager(true);
						}}
					>
						Edit Tags
					</DropdownMenu.Item>
					{publishEnabled && (
						<Suspense>
							<DropdownMenu.Item render={<Link to="/recipes/published" />}>
								Shared Recipes
							</DropdownMenu.Item>
						</Suspense>
					)}
				</DropdownMenu.Content>
			</DropdownMenu>
		</>
	);
}
