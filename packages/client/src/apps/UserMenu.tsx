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
import { LoginLink } from '../common/LoginButton.js';
import { PresencePeople } from '../common/PresencePeople.js';
import * as CONFIG from '../config.js';
import {
	useHasServerAccess,
	useIsLoggedIn,
	useIsOffline,
} from '../hooks/graphql.js';
import { getIsPWAInstalled } from '../platform.js';
import { InstallButton } from './InstallButton.js';
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
				<DropdownMenu.Trigger
					render={(props: any) => (
						<Button size="small" emphasis="ghost" {...props} />
					)}
				>
					{(children ?? (!isLoggedIn && loading && !isOffline)) ?
						<Icon name="refresh" className="animate-spin" />
					: isLoggedIn ?
						<>
							{!hasServerAccess && <Icon name="refreshDisabled" />}
							<ErrorBoundary fallback={<Avatar />}>
								<Suspense fallback={<Avatar />}>
									<PresencePeople />
								</Suspense>
							</ErrorBoundary>
						</>
					:	<>
							<Icon
								name="refreshDisabled"
								className={isOffline ? 'color-attention' : ''}
							/>
							<Icon name="gear" className="h-25px" />
						</>
					}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					{isOffline && (
						<div className="max-w-300px py-1 pl-8 pr-4 text-sm color-attention-dark color-gray-dark bg-attention-wash">
							Offline - some features may be unavailable
						</div>
					)}
					{isLoggedIn && !hasServerAccess && (
						<div className="max-w-300px py-1 pl-8 pr-4 text-sm color-gray-dark color-gray-dark bg-wash">
							Your plan does not include sync for this app
						</div>
					)}

					{!isLoggedIn ?
						<>
							<DropdownMenu.Item
								render={
									<a href={`${CONFIG.HOME_ORIGIN}/join?appReferrer=${appId}`} />
								}
								color="accent"
								className="color-main-ink bg-main-wash focus-visible:bg-main-light"
							>
								Upgrade for sync
								<DropdownMenuItemRightSlot>
									<Icon name="gift" />
								</DropdownMenuItemRightSlot>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								render={<LoginLink className="font-inherit color-inherit" />}
							>
								Log in
								<DropdownMenuItemRightSlot>
									<Icon name="arrowRight" />
								</DropdownMenuItemRightSlot>
							</DropdownMenu.Item>
						</>
					:	<>
							<DropdownMenu.Item
								render={
									<a
										href={`${CONFIG.HOME_ORIGIN}/settings?appReferrer=${appId}`}
									/>
								}
							>
								Manage plan
								<DropdownMenuItemRightSlot>
									<Icon name="profile" />
								</DropdownMenuItemRightSlot>
							</DropdownMenu.Item>
						</>
					}

					{!disableAppSettings && (
						<DropdownMenu.Item render={<a href="/settings" />}>
							App settings
							<DropdownMenuItemRightSlot>
								<Icon name="gear" />
							</DropdownMenuItemRightSlot>
						</DropdownMenu.Item>
					)}
					{getIsPWAInstalled() ?
						<DropdownMenu.Item onClick={openPwaHackCatalog}>
							More apps
							<DropdownMenuItemRightSlot>
								<Icon name="new_window" />
							</DropdownMenuItemRightSlot>
						</DropdownMenu.Item>
					:	<>
							<DropdownMenu.Item
								render={<a href={`${CONFIG.HOME_ORIGIN}`} target="_blank" />}
							>
								More apps
								<DropdownMenuItemRightSlot>
									<Icon name="new_window" />
								</DropdownMenuItemRightSlot>
							</DropdownMenu.Item>
						</>
					}
					<DropdownMenu.Item
						render={
							<a href={`${CONFIG.HOME_ORIGIN}/contact`} target="_blank" />
						}
					>
						Contact support
						<DropdownMenuItemRightSlot>
							<Icon name="profile" />
						</DropdownMenuItemRightSlot>
					</DropdownMenu.Item>
					{!getIsPWAInstalled() && (
						<Suspense>
							<DropdownMenu.Item
								render={
									<InstallButton
										emphasis="primary"
										size="small"
										className="mx-lg my-sm justify-between"
									/>
								}
								color="accent"
							>
								Install app
								<Icon name="download" />
							</DropdownMenu.Item>
						</Suspense>
					)}
					{extraItems && <DropdownMenu.Separator />}
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
		<Button
			color="accent"
			emphasis="ghost"
			size="small"
			className="font-normal"
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
	);
}
