import { Button, clsx, Icon, PageNowPlaying } from '@a-type/ui';
import { List } from '@wish-wash.biscuits/verdant';
import { useState } from 'react';
import { AddInput } from './AddInput.jsx';
import { AddOptions } from './AddOptions.jsx';
import { AddOptionsCollapsible } from './AddOptionsCollapsible.jsx';
import { AddItemProvider } from './AddProvider.jsx';

export interface AddPaneProps {
	list: List;
	className?: string;
}

export function AddPane({ list, className }: AddPaneProps) {
	const [open, setOpen] = useState(false);

	return (
		<PageNowPlaying
			unstyled
			className={clsx('items-center justify-center p-3', className)}
			keepAboveKeyboard
		>
			{!open ?
				<Button onClick={() => setOpen(true)} color="primary">
					<Icon name="plus" />
					Add something
				</Button>
			:	<AddItemProvider list={list}>
					<div className="flex flex-col items-stretch">
						<AddInput />
						<AddOptionsCollapsible>
							<AddOptions />
						</AddOptionsCollapsible>
					</div>
				</AddItemProvider>
			}
		</PageNowPlaying>
	);
}
