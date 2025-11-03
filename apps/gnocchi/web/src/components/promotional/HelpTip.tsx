import { Button, Popover, PopoverContent, PopoverTrigger } from '@a-type/ui';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';

export interface HelpTipProps {
	children: ReactNode;
}

export function HelpTip({ children }: HelpTipProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button emphasis="ghost">
					<QuestionMarkCircledIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<span className="text-sm">{children}</span>
			</PopoverContent>
		</Popover>
	);
}
