import { Popover } from '@a-type/ui';
import { preventDefault } from '@a-type/utils';
import { List } from '@wish-wash.biscuits/verdant';
import { ReactNode } from 'react';
import { AddInput } from './AddInput.jsx';
import { AddOptions } from './AddOptions.jsx';
import { AddItemProvider, useAddItem } from './AddProvider.jsx';

export interface AddSectionProps {
	className?: string;
	list: List;
}

export function AddSection({ className, list }: AddSectionProps) {
	return (
		<AddItemProvider list={list}>
			<ControlledPopover>
				<Popover.Anchor className={className}>
					<AddInput className="w-full" />
				</Popover.Anchor>
				<PopoverContent>
					<AddOptions />
				</PopoverContent>
			</ControlledPopover>
		</AddItemProvider>
	);
}

function ControlledPopover({ children }: { children: ReactNode }) {
	const { isOpen } = useAddItem();

	return <Popover open={isOpen}>{children}</Popover>;
}

function PopoverContent({ children, ...props }: { children: ReactNode }) {
	const { getMenuProps, isOpen } = useAddItem();

	return (
		<Popover.Content
			forceMount
			disableBlur
			radius="md"
			sideOffset={12}
			onOpenAutoFocus={preventDefault}
			className="w-[max(var(--radix-popover-trigger-width),600px)] rounded-xl"
			align="center"
			{...getMenuProps(props)}
		>
			{isOpen ? children : null}
		</Popover.Content>
	);
}
