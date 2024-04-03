import { Button } from '@a-type/ui/components/button';
import { useMe } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';

export interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { data } = useMe();

  if (!data?.me) {
    return (
      <Link to="/join">
        <Button color="primary" className={classNames(className)}>
          Join the club
        </Button>
      </Link>
    );
  }

  const name = data.me.name;

  return (
    <Link to="/plan">
      <Button className={classNames(className)}>Hi, {name}!</Button>
    </Link>
  );
}
