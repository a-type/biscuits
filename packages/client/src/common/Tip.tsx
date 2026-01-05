import { Chip, ChipProps, Dialog, Icon } from '@a-type/ui';
import { ReactNode } from 'react';

export interface TipProps extends Omit<ChipProps, 'content' | 'children'> {
	title: string;
	content: ReactNode;
}

export function Tip({ content, title, ...rest }: TipProps) {
	return (
		<Dialog>
			<Dialog.Trigger render={<Chip color="accent" {...rest} />}>
				<Icon name="lightbulb" />
				<span>{title}</span>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>{title}</Dialog.Title>
				{content}
				<Dialog.Actions>
					<Dialog.Close>Close</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
