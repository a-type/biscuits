import { clsx, Icon, QuickAction, ScrollArea } from '@a-type/ui';
import { useState } from 'react';
import {
	AddBarComboboxInput,
	AddBarComboboxItems,
	AddBarComboboxRoot,
} from './combobox.jsx';
import { useKeepOpenAfterSelect, useParticlesOnAdd } from './hooks.js';

export interface FloatingAddProps {
	className?: string;
}

export function FloatingAdd({ className, ...rest }: FloatingAddProps) {
	const [keepOpenOnSelect] = useKeepOpenAfterSelect();
	const particleRef = useParticlesOnAdd(!keepOpenOnSelect);
	const [open, setOpen] = useState(false);

	return (
		<AddBarComboboxRoot onOpenChange={setOpen}>
			<QuickAction modal="trap-focus" open={open} onOpenChange={setOpen}>
				<QuickAction.Trigger
					ref={particleRef}
					emphasis="primary"
					className={clsx(
						'z-100 h-48px w-48px items-center justify-center rounded-lg shadow-xl',
						// only visible on mobile
						'md:hidden',
					)}
					{...rest}
				>
					<Icon name="plus" size={20} />
				</QuickAction.Trigger>
				<QuickAction.Content
					initialFocus={false}
					className="max-h-[calc(var(--viewport-height,40dvh)-140px)] max-w-96vw w-full flex flex-col"
				>
					<ScrollArea className="w-full flex-1" direction="vertical">
						<AddBarComboboxItems />
					</ScrollArea>
					<AddBarComboboxInput className="rounded-md" />
				</QuickAction.Content>
			</QuickAction>
		</AddBarComboboxRoot>
	);
}
