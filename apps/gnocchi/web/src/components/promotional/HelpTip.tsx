import {
	Button,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Text,
} from '@a-type/ui';
import { ReactNode } from 'react';

export interface HelpTipProps {
	children: ReactNode;
	'aria-label': string;
}

export function HelpTip({ children, 'aria-label': ariaLabel }: HelpTipProps) {
	return (
		<Popover>
			<PopoverTrigger
				render={<Button emphasis="ghost" aria-label={ariaLabel} />}
			>
				<Icon name="info" />
			</PopoverTrigger>
			<PopoverContent>
				<Text emphasis="ambient">{children}</Text>
			</PopoverContent>
		</Popover>
	);
}
