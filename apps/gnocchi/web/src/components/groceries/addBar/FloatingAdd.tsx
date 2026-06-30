import { clsx, Icon, QuickAction, ScrollArea } from '@a-type/ui';
import { useState } from 'react';
import {
	AddBarComboboxInput,
	AddBarComboboxItems,
	AddBarComboboxRoot,
} from './combobox.jsx';
import cls from './FloatingAdd.module.css';
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
					className={clsx(cls.trigger, className)}
					{...rest}
				>
					<Icon name="plus" size={20} />
				</QuickAction.Trigger>
				<QuickAction.Content initialFocus={false} className={cls.content}>
					<ScrollArea className={cls.scrollArea} direction="vertical">
						<AddBarComboboxItems />
					</ScrollArea>
					<AddBarComboboxInput className={cls.input} />
				</QuickAction.Content>
			</QuickAction>
		</AddBarComboboxRoot>
	);
}
