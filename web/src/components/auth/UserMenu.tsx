import { Button } from '@a-type/ui/components/button';
import { client } from '@biscuits/client/react';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';

export interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { data } = client.auth.session.useQuery();

  if (!data?.session) {
    return (
      <Link to="/join">
        <Button className={classNames(className)}>Sign in</Button>
      </Link>
    );
  }

  const name = data.session.name;

  return (
    <Link to="/plan">
      <Button className={classNames(className)}>Hi, {name}!</Button>
    </Link>
  );
}
