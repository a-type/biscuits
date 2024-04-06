import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { useNavigate } from '@verdant-web/react-router';
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
  const navigate = useNavigate();

  return (
    <Button
      color="primary"
      onClick={async () => {
        const list = await client.lists.put({
          name: 'New list',
        });
        navigate(`/lists/${list.get('id')}`);
      }}
      className={className}
      {...rest}
    >
      {children || 'Add list'}
    </Button>
  );
}
