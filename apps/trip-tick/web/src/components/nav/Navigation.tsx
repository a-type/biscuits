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
import { AppPicker, AppPickerNavItem } from '@biscuits/client';
import { Logo } from '../brand/Logo.jsx';

export interface NavigationProps {}

export function Navigation({}: NavigationProps) {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useOnLocationChange((location) => setPathname(location.pathname));
  const matchTrips = pathname === '/' || pathname.startsWith('/trips');
  const matchLists = pathname.startsWith('/lists');

  return (
    <PageNav className="">
      <div className="hidden sm:(flex flex-row gap-2 items-center justify-center px-2 py-2 mt-3)">
        <h1 className="text-md [font-family:'VC_Henrietta_Trial','Noto_Serif',serif] font-normal">
          Trip Tick
        </h1>
        <Logo className="w-12" />
      </div>
      <NavBarRoot>
        <NavBarItem
          asChild
          className="[&[data-active=true]]:(bg-primary-wash color-black)"
        >
          <Link to="/" data-active={matchTrips}>
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

        <AppPickerNavItem />
      </NavBarRoot>
    </PageNav>
  );
}