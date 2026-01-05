import { useResetCategoriesToDefault } from '@/stores/groceries/mutations.js';
import { Button, Dialog } from '@a-type/ui';
import { ReactElement, Suspense } from 'react';
import { CategoryManager } from '../groceries/categories/CategoryManager.js';
import { menuState } from './state.js';

export function ManageCategoriesDialog({
	children,
}: {
	children: ReactElement;
}) {
	const resetToDefaults = useResetCategoriesToDefault();

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					menuState.open = false;
				}
			}}
		>
			<Dialog.Trigger render={children} />
			<Dialog.Content>
				<Dialog.Title>Categories</Dialog.Title>
				<Suspense fallback={null}>
					<CategoryManager />
				</Suspense>
				<Dialog.Actions>
					<Button emphasis="ghost" onClick={resetToDefaults}>
						Reset to defaults
					</Button>
					<Dialog.Close />
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
