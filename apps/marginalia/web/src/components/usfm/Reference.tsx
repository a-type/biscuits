import {
	Button,
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@a-type/ui';
import { ReactNode } from 'react';

export interface ReferenceProps {
	caller: string;
	children: ReactNode;
}

export function Reference({ caller, children }: ReferenceProps) {
	return (
		<Popover>
			<PopoverTrigger data-type="cross-reference" asChild>
				<Button size="icon" color="ghost" className="inline-flex p-0">
					{caller === '+' ? '*' : caller}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				{children}
			</PopoverContent>
		</Popover>
	);
}
