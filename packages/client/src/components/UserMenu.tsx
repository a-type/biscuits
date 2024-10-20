import { Avatar } from '@a-type/ui/components/avatar';
import { Button } from '@a-type/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemProps,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
} from '@a-type/ui/components/dropdownMenu';
import { Icon } from '@a-type/ui/components/icon';
import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { LogoutButton } from './LogoutButton.js';
import { PresencePeople } from './PresencePeople.js';
import { graphql, useSuspenseQuery } from '@biscuits/graphql';
import {
	useHasServerAccess,
	useIsLoggedIn,
	useIsOffline,
} from '../hooks/graphql.js';
import { useAppId } from './Context.js';
import { getIsPWAInstalled } from '../platform.js';
import { LoginButton } from './LoginButton.js';
import * as CONFIG from '../config.js';

export interface UserMenuProps {
	className?: string;
	disableAppSettings?: boolean;
	children?: ReactNode;
	extraItems?: ReactNode;
}

export function UserMenu({
	className,
	disableAppSettings,
	children,
	extraItems,
}: UserMenuProps) {
	const [isLoggedIn, loading] = useIsLoggedIn();
	const isOffline = useIsOffline();
	const appId = useAppId();
	const hasServerAccess = useHasServerAccess();

	const openPwaHackCatalog = () => {
		// since we can't just open a new tab, use a share
		// intent to open the PWA catalog URL
		navigator.share({
			url: `${CONFIG.HOME_ORIGIN}/apps`,
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{children ?? (!isLoggedIn && loading && !isOffline) ?
					<Button size="small" color="ghost" className={className}>
						<Icon name="refresh" className="animate-spin" />
						<Icon name="gear" />
					</Button>
				: isLoggedIn ?
					<Button size="small" color="ghost" className={className}>
						{!hasServerAccess && <Icon name="refreshDisabled" />}
						<ErrorBoundary fallback={<Avatar />}>
							<Suspense fallback={<Avatar />}>
								<PresencePeople />
							</Suspense>
						</ErrorBoundary>
						<Icon name="gear" />
					</Button>
				:	<Button size="small" color="ghost" className={className}>
						<Icon
							name="refreshDisabled"
							className={isOffline ? 'color-attention' : ''}
						/>
						<Icon name="gear" />
					</Button>
				}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{isOffline && (
					<div className="pl-8 pr-4 py-1 text-gray-7 text-sm max-w-300px bg-attention-wash color-attention-dark">
						Offline - some features may be unavailable
					</div>
				)}
				{isLoggedIn && !hasServerAccess && (
					<div className="pl-8 pr-4 py-1 text-gray-7 text-sm max-w-300px color-gray-7">
						Your plan does not include this app
					</div>
				)}

				{!isLoggedIn ?
					<>
						<DropdownMenuItem
							asChild
							className="theme-leek bg-primary-wash color-primary-dark"
						>
							<a href={`${CONFIG.HOME_ORIGIN}/join?appReferrer=${appId}`}>
								Upgrade for sync
								<DropdownMenuItemRightSlot>
									<Icon name="gift" />
								</DropdownMenuItemRightSlot>
							</a>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<LoginButton className="border-none transition-none shadow-none">
								Log in
								<DropdownMenuItemRightSlot>
									<Icon name="arrowRight" />
								</DropdownMenuItemRightSlot>
							</LoginButton>
						</DropdownMenuItem>
					</>
				:	<DropdownMenuItem asChild>
						<a href={`${CONFIG.HOME_ORIGIN}/settings?appReferrer=${appId}`}>
							Mange plan
							<DropdownMenuItemRightSlot>
								<Icon name="profile" />
							</DropdownMenuItemRightSlot>
						</a>
					</DropdownMenuItem>
				}
				{getIsPWAInstalled() ?
					<DropdownMenuItem onClick={openPwaHackCatalog}>
						More apps
						<DropdownMenuItemRightSlot>
							<Icon name="new_window" />
						</DropdownMenuItemRightSlot>
					</DropdownMenuItem>
				:	<DropdownMenuItem asChild>
						<a href={`${CONFIG.HOME_ORIGIN}`} target="_blank">
							More apps
							<DropdownMenuItemRightSlot>
								<Icon name="new_window" />
							</DropdownMenuItemRightSlot>
						</a>
					</DropdownMenuItem>
				}
				{!disableAppSettings && (
					<DropdownMenuItem asChild>
						<a href={`/settings`}>
							App settings
							<DropdownMenuItemRightSlot>
								<Icon name="gear" />
							</DropdownMenuItemRightSlot>
						</a>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem asChild>
					<a href={`${CONFIG.HOME_ORIGIN}/contact`} target="_blank">
						Contact support
						<DropdownMenuItemRightSlot>
							<Icon name="profile" />
						</DropdownMenuItemRightSlot>
					</a>
				</DropdownMenuItem>
				{!!isLoggedIn && (
					<DropdownMenuItem asChild>
						<LogoutButton className="border-none transition-none shadow-none">
							Log out
							<DropdownMenuItemRightSlot>
								<Icon name="arrowRight" />
							</DropdownMenuItemRightSlot>
						</LogoutButton>
					</DropdownMenuItem>
				)}
				{extraItems}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function UserMenuItem(props: DropdownMenuItemProps) {
	return <DropdownMenuItem {...props} />;
}

const userAvatarQuery = graphql(`
	query UserAvatarQuery {
		me {
			id
			imageUrl
		}
	}
`);

export function UserAvatar({
	className,
	skipFetch,
}: {
	className?: string;
	skipFetch?: boolean;
}) {
	const result = useSuspenseQuery(userAvatarQuery, { skip: skipFetch });

	return (
		<Avatar
			imageSrc={result?.data?.me?.imageUrl ?? undefined}
			className={className}
			popIn={false}
		/>
	);
}
