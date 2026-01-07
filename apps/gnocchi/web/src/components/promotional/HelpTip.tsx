import {
	Button,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@a-type/ui';
import { ReactNode } from 'react';

export interface HelpTipProps {
	children: ReactNode;
}

export function HelpTip({ children }: HelpTipProps) {
	return (
		<Popover>
			<PopoverTrigger render={<Button emphasis="ghost" />}>
				<Icon name="info" />
			</PopoverTrigger>
			<PopoverContent>
				<span className="text-sm">{children}</span>
			</PopoverContent>
		</Popover>
	);
}
