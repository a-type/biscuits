import { PageNav } from '@a-type/ui/components/layouts';
import { Link, useMatch, useOnLocationChange } from '@verdant-web/react-router';
import {
  NavBarRoot,
  NavBarItem,
  NavBarItemText,
  NavBarItemIconWrapper,
  NavBarItemIcon,
} from '@a-type/ui/components/navBar';
import { useState } from 'react';

export interface NavigationProps {}

export function Navigation({}: NavigationProps) {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useOnLocationChange((location) => setPathname(location.pathname));
  const matchLists = pathname.startsWith('/lists');
  const matchTrips = pathname.startsWith('/trips');

  return (
    <PageNav className="sm:mt-4">
      <NavBarRoot>
        <NavBarItem
          asChild
          className="[&[data-active=true]]:(bg-primary-wash color-black)"
        >
          <Link to="/trips" data-active={matchTrips}>
            <NavBarItemIconWrapper>
              <NavBarItemIcon className="i-solar-suitcase-tag-linear" />
            </NavBarItemIconWrapper>
            <NavBarItemText>Trips</NavBarItemText>
          </Link>
        </NavBarItem>
        <NavBarItem
          asChild
          className="[&[data-active=true]]:(bg-primary-wash color-black)"
        >
          <Link to="/lists" data-active={matchLists}>
            <NavBarItemIconWrapper>
              <NavBarItemIcon className="i-solar-checklist-linear" />
            </NavBarItemIconWrapper>
            <NavBarItemText>Lists</NavBarItemText>
          </Link>
        </NavBarItem>
      </NavBarRoot>
    </PageNav>
  );
}
