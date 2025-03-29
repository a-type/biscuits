import { Box, clsx, Icon, PageNowPlaying } from '@a-type/ui';
import {
	MenuDiscloseContent,
	MenuDiscloseRoot,
	MenuDiscloseTrigger,
} from '@biscuits/client';
import { List } from '@wish-wash.biscuits/verdant';
import { useState } from 'react';
import { AddInput } from './AddInput.jsx';
import { AddOptions } from './AddOptions.jsx';
import { AddOptionsCollapsible } from './AddOptionsCollapsible.jsx';
import { AddItemProvider, useAddItem } from './AddProvider.jsx';

export interface AddPaneProps {
	list: List;
	className?: string;
}

export function AddPane({ list, className }: AddPaneProps) {
	return (
		<AddItemProvider list={list}>
			<PageNowPlaying
				unstyled
				className={clsx('items-center justify-center p-3', className)}
				keepAboveKeyboard
			>
				<AddPaneContent />
			</PageNowPlaying>
		</AddItemProvider>
	);
}

function AddPaneContent() {
	const { setInputValue } = useAddItem();
	const [open, setOpen] = useState(false);

	return (
		<MenuDiscloseRoot
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (!v) {
					setInputValue('');
				}
			}}
		>
			<MenuDiscloseTrigger>
				<Icon name="plus" />
			</MenuDiscloseTrigger>
			<MenuDiscloseContent className="w-90vw max-w-[600px]">
				<Box surface="primary" p="sm" d="col" gap="sm">
					<AddInput autoFocus={open} />
					<AddOptionsCollapsible>
						<AddOptions />
					</AddOptionsCollapsible>
				</Box>
			</MenuDiscloseContent>
		</MenuDiscloseRoot>
	);
}
