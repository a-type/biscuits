import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@a-type/ui';
import { ReactNode, Suspense } from 'react';
import { CategoryManager } from '../groceries/categories/CategoryManager.js';
import { menuState } from './state.js';

export function ManageCategoriesDialog({ children }: { children: ReactNode }) {
	const resetToDefaults = hooks.useResetCategoriesToDefault();

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					menuState.open = false;
				}
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogTitle>Categories</DialogTitle>
				<Suspense fallback={null}>
					<CategoryManager />
				</Suspense>
				<DialogActions>
					<Button color="ghost" onClick={resetToDefaults}>
						Reset to defaults
					</Button>
					<DialogClose asChild>
						<Button>Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
