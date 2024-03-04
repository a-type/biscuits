import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { ReactNode } from 'react';

export interface AddListButtonProps {
  children?: ReactNode;
  className?: string;
}

export function AddListButton({
  children,
  className,
  ...rest
}: AddListButtonProps) {
  const client = hooks.useClient();

  return (
    <Button
      color="primary"
      onClick={() => {
        client.lists.put({
          name: 'New list',
        });
      }}
      className={className}
      {...rest}
    >
      {children || 'Add list'}
    </Button>
  );
}
