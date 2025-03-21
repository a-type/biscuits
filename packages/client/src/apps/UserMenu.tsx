import {
	Avatar,
	Box,
	Button,
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuItemProps,
	DropdownMenuItemRightSlot,
	ErrorBoundary,
	Icon,
} from '@a-type/ui';
import { graphql, useSuspenseQuery } from '@biscuits/graphql';
import { ComponentProps, ReactNode, Suspense, useState } from 'react';
import { useAppId } from '../common/Context.js';
import { LoginButton } from '../common/LoginButton.js';
import { PresencePeople } from '../common/PresencePeople.js';
import * as CONFIG from '../config.js';
import {
	useHasServerAccess,
	useIsLoggedIn,
	useIsOffline,
} from '../hooks/graphql.js';
import { getIsPWAInstalled } from '../platform.js';
import { updateApp, useIsUpdateAvailable } from './updateState.js';

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
		<Box d="row" items="center" gap="sm" className={className}>
			<SmallUpdatePrompt />
			<DropdownMenu>
				<DropdownMenu.Trigger asChild>
					{(children ?? (!isLoggedIn && loading && !isOffline)) ?
						<Button size="small" color="ghost">
							<Icon name="refresh" className="animate-spin" />
							{/* match height with avatar */}
							<Icon name="gear" className="h-25px" />
						</Button>
					: isLoggedIn ?
						<Button size="small" color="ghost">
							{!hasServerAccess && <Icon name="refreshDisabled" />}
							<ErrorBoundary fallback={<Avatar />}>
								<Suspense fallback={<Avatar />}>
									<PresencePeople />
								</Suspense>
							</ErrorBoundary>
							<Icon name="gear" className="h-25px" />
						</Button>
					:	<Button size="small" color="ghost">
							<Icon
								name="refreshDisabled"
								className={isOffline ? 'color-attention' : ''}
							/>
							<Icon name="gear" className="h-25px" />
						</Button>
					}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					{isOffline && (
						<div className="pl-8 pr-4 py-1 color-gray-dark text-sm max-w-300px bg-attention-wash color-attention-dark">
							Offline - some features may be unavailable
						</div>
					)}
					{isLoggedIn && !hasServerAccess && (
						<div className="bg-wash pl-8 pr-4 py-1 color-gray-dark text-sm max-w-300px color-gray-dark">
							Your plan does not include sync for this app
						</div>
					)}

					{!isLoggedIn ?
						<>
							<DropdownMenu.Item
								asChild
								className="theme-leek bg-primary-wash color-primary-dark"
							>
								<a href={`${CONFIG.HOME_ORIGIN}/join?appReferrer=${appId}`}>
									Upgrade for sync
									<DropdownMenuItemRightSlot>
										<Icon name="gift" />
									</DropdownMenuItemRightSlot>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item asChild>
								<LoginButton className="border-none transition-none shadow-none">
									Log in
									<DropdownMenuItemRightSlot>
										<Icon name="arrowRight" />
									</DropdownMenuItemRightSlot>
								</LoginButton>
							</DropdownMenu.Item>
						</>
					:	<DropdownMenu.Item asChild>
							<a href={`${CONFIG.HOME_ORIGIN}/settings?appReferrer=${appId}`}>
								Mange plan
								<DropdownMenuItemRightSlot>
									<Icon name="profile" />
								</DropdownMenuItemRightSlot>
							</a>
						</DropdownMenu.Item>
					}

					{!disableAppSettings && (
						<DropdownMenu.Item asChild>
							<a href={`/settings`}>
								App settings
								<DropdownMenuItemRightSlot>
									<Icon name="gear" />
								</DropdownMenuItemRightSlot>
							</a>
						</DropdownMenu.Item>
					)}
					{getIsPWAInstalled() ?
						<DropdownMenu.Item onClick={openPwaHackCatalog}>
							More apps
							<DropdownMenuItemRightSlot>
								<Icon name="new_window" />
							</DropdownMenuItemRightSlot>
						</DropdownMenu.Item>
					:	<DropdownMenu.Item asChild>
							<a href={`${CONFIG.HOME_ORIGIN}`} target="_blank">
								More apps
								<DropdownMenuItemRightSlot>
									<Icon name="new_window" />
								</DropdownMenuItemRightSlot>
							</a>
						</DropdownMenu.Item>
					}
					<DropdownMenu.Item asChild>
						<a href={`${CONFIG.HOME_ORIGIN}/contact`} target="_blank">
							Contact support
							<DropdownMenuItemRightSlot>
								<Icon name="profile" />
							</DropdownMenuItemRightSlot>
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					{extraItems}
				</DropdownMenu.Content>
			</DropdownMenu>
		</Box>
	);
}

export function UserMenuItem(props: DropdownMenuItemProps) {
	return <DropdownMenuItem {...props} />;
}

export function UserMenuItemRightSlot(
	props: ComponentProps<typeof DropdownMenuItemRightSlot>,
) {
	return <DropdownMenuItemRightSlot {...props} />;
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

function SmallUpdatePrompt() {
	const updateAvailable = useIsUpdateAvailable();
	const [loading, setLoading] = useState(false);

	if (!updateAvailable) {
		return null;
	}

	return (
		<Box surface="accent" p="xs" gap="xs" asChild>
			<Button
				color="ghostAccent"
				onClick={async () => {
					try {
						setLoading(true);
						await updateApp(true);
					} finally {
						setLoading(false);
					}
				}}
				loading={loading}
			>
				<Icon name="star" />
				<span>Update</span>
			</Button>
		</Box>
	);
}
