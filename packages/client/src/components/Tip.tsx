import { Chip, ChipProps } from '@a-type/ui/components/chip';
import { Dialog } from '@a-type/ui/components/dialog';
import { Icon } from '@a-type/ui/components/icon';
import { ReactNode } from 'react';

export interface TipProps extends Omit<ChipProps, 'content' | 'children'> {
  title: string;
  content: ReactNode;
}

export function Tip({ content, title, ...rest }: TipProps) {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Chip color="accent" {...rest}>
          <Icon name="lightbulb" />
          <span>{title}</span>
        </Chip>
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