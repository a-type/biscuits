import { Link } from '@/components/nav/Link.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	IconName,
	NavBarItem,
	NavBarItemIcon,
	NavBarItemIconWrapper,
	NavBarItemText,
	NavBarRoot,
	PageNav,
	clsx,
	withClassName,
} from '@a-type/ui';
import {
	AppPickerNavItem,
	NavBarChangelog,
	OnboardingTooltip,
} from '@biscuits/client';
import { useOnLocationChange } from '@verdant-web/react-router';
import {
	ReactNode,
	Suspense,
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../groceries/state.js';
import { useHasNewExpirations } from '../pantry/hooks.js';
import { useRecipePresenceNotification } from '../sync/collaborationMenu/RecipePresenceNotification.jsx';
import { PopEffect } from './PopEffect.jsx';

export interface NavBarProps {}

export function NavBar({}: NavBarProps) {
	const [pathname, setPathname] = useState(() => window.location.pathname);
	useOnLocationChange((location) => setPathname(location.pathname));
	const matchDefaultList = pathname === '/';
	const matchList = pathname.startsWith('/list');
	const matchGroceries = matchDefaultList || matchList;
	const matchPurchased = pathname.startsWith('/pantry');
	const matchRecipes = pathname.startsWith('/recipes');

	return (
		<PageNav>
			<Suspense>
				<Box gap="sm" layout="center center" p="sm" className="lt-md:hidden">
					<img src="/android-chrome-192x192.png" className="w-30px h-30px" />
					<h1 className="text-md font-fancy font-semibold">Gnocchi</h1>
				</Box>
				<NavBarRoot>
					<GroceriesNavBarLink active={matchGroceries} />
					<PantryNavBarLink active={matchPurchased} />
					<RecipesNavBarLink active={matchRecipes} />
					<AppPickerNavItem />
					<NavBarChangelog />
				</NavBarRoot>
			</Suspense>
		</PageNav>
	);
}

const NavBarLink = memo(
	forwardRef<
		HTMLAnchorElement,
		{
			to: string;
			children: ReactNode;
			icon: IconName;
			animate?: boolean;
			active: boolean;
			onClick?: () => void;
			onHover?: () => void;
		}
	>(function NavBarLink(
		{ to, children, icon, animate, active, onHover, onClick },
		ref,
	) {
		return (
			<NavBarItem
				render={
					<Link
						to={to}
						className={clsx({
							active,
						})}
						data-active={active}
						onMouseOver={onHover}
						onClick={onClick}
						ref={ref}
					/>
				}
			>
				<NavBarItemIconWrapper className="flex">
					<PopEffect active={animate} />
					<NavBarItemIcon name={icon} />
				</NavBarItemIconWrapper>
				<NavBarItemText data-active={!!active}>{children}</NavBarItemText>
			</NavBarItem>
		);
	}),
);

function RecipesNavBarLink({ active }: { active: boolean }) {
	const client = hooks.useClient();
	const preload = useCallback(() => {
		// fire off the query to preload it
		client.recipes.findAll();
	}, [client]);

	const { peer: someoneViewingRecipe } = useRecipePresenceNotification();

	return (
		<NavBarLink to="/recipes" icon="book" active={active} onHover={preload}>
			<span>Recipes</span>
			{someoneViewingRecipe && <Pip />}
		</NavBarLink>
	);
}

const Pip = withClassName(
	'div',
	'absolute top-6px right-6px w-6px h-6px rounded-full bg-attention shadow-sm',
);

function PantryNavBarLink({ active }: { active: boolean }) {
	const [newExpiredTime, onSeen] = useHasNewExpirations();

	return (
		<NavBarLink to="/pantry" icon="food" active={active} onClick={onSeen}>
			<span>Pantry</span>
			{newExpiredTime && <Pip />}
		</NavBarLink>
	);
}

function GroceriesNavBarLink({ active }: { active: boolean }) {
	const justAddedSomething = useSnapshot(groceriesState).justAddedSomething;

	useEffect(() => {
		if (justAddedSomething) {
			navigator.vibrate?.([50, 50, 50]);

			const timeout = setTimeout(() => {
				groceriesState.justAddedSomething = false;
			}, 1500);
			return () => clearTimeout(timeout);
		}
	}, [justAddedSomething]);

	return (
		<OnboardingTooltip
			content={<div>You&apos;ll find your groceries here.</div>}
			onboarding={saveHubRecipeOnboarding}
			step="viewList"
		>
			<NavBarLink
				to="/"
				icon="cart"
				active={active}
				animate={justAddedSomething}
			>
				Groceries
			</NavBarLink>
		</OnboardingTooltip>
	);
}
