import { Button } from '@a-type/ui/components/button';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import { graphql } from '@/graphql.js';
import { useQuery } from 'urql';

export interface UserMenuProps {
  className?: string;
}

const UserMenuMe = graphql(`
  query UserMenuMe {
    me {
      id
      name
    }
  }
`);

export function UserMenu({ className }: UserMenuProps) {
  const [{ data }] = useQuery({ query: UserMenuMe });

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
