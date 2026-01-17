import {
	NavBarItem,
	NavBarItemIcon,
	NavBarItemIconWrapper,
	NavBarItemText,
	NavBarRoot,
	PageNav,
} from '@a-type/ui';
import { Link, useOnLocationChange } from '@verdant-web/react-router';
import { useState } from 'react';
import { Logo } from '../brand/Logo.jsx';

export interface NavigationProps {}

export function Navigation({}: NavigationProps) {
	const [pathname, setPathname] = useState(() => window.location.pathname);
	useOnLocationChange((location) => setPathname(location.pathname));
	const matchTrips = pathname === '/' || pathname.startsWith('/trips');
	const matchLists = pathname.startsWith('/lists');

	return (
		<PageNav className="">
			<div className="hidden sm:(mt-3 flex flex-row items-center justify-center gap-2 px-2 py-2)">
				<Logo className="w-12" />
				<h1 className="[font-family:'Henrietta','Noto_Serif',serif] text-md font-semibold">
					Trip Tick
				</h1>
			</div>
			<NavBarRoot>
				<NavBarItem
					className="[&[data-active=true]]:(color-black bg-primary-wash)"
					render={<Link to="/" data-active={matchTrips} />}
				>
					<NavBarItemIconWrapper>
						<NavBarItemIcon className="i-solar-suitcase-tag-linear fill-inherit" />
					</NavBarItemIconWrapper>
					<NavBarItemText>Trips</NavBarItemText>
				</NavBarItem>
				<NavBarItem
					className="[&[data-active=true]]:(color-black bg-primary-wash)"
					render={<Link to="/lists" data-active={matchLists} />}
				>
					<NavBarItemIconWrapper>
						<NavBarItemIcon className="i-solar-checklist-linear" />
					</NavBarItemIconWrapper>
					<NavBarItemText>Lists</NavBarItemText>
				</NavBarItem>
			</NavBarRoot>
		</PageNav>
	);
}
