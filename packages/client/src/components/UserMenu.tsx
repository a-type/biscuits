import { Avatar } from '@a-type/ui/components/avatar';
import { Button } from '@a-type/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemRightSlot,
  DropdownMenuTrigger,
} from '@a-type/ui/components/dropdownMenu';
import {
  CONFIG,
  getIsPWAInstalled,
  graphql,
  useAppId,
  useIsLoggedIn,
  useIsOffline,
  useSuspenseQuery,
} from '../index.js';
import { Icon } from '@a-type/ui/components/icon';
import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';

export interface UserMenuProps {
  className?: string;
  disableAppSettings?: boolean;
  children?: ReactNode;
}

export function UserMenu({
  className,
  disableAppSettings,
  children,
}: UserMenuProps) {
  const [isLoggedIn] = useIsLoggedIn();
  const isOffline = useIsOffline();
  const appId = useAppId();

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
        <Button size="icon" color="ghost" className={className}>
          {children ?? (
            <ErrorBoundary fallback={<Avatar />}>
              <Suspense fallback={<Avatar />}>
                <UserAvatar skipFetch={!isLoggedIn} />
              </Suspense>
            </ErrorBoundary>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isOffline && (
          <div className="pl-8 pr-4 py-1 text-gray-7 font-sm max-w-300px">
            Offline - some features may be unavailable
          </div>
        )}

        {!isLoggedIn ? (
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
        ) : (
          <DropdownMenuItem asChild>
            <a href={`${CONFIG.HOME_ORIGIN}/plan?appReferrer=${appId}`}>
              Mange plan
              <DropdownMenuItemRightSlot>
                <Icon name="profile" />
              </DropdownMenuItemRightSlot>
            </a>
          </DropdownMenuItem>
        )}
        {getIsPWAInstalled() ? (
          <DropdownMenuItem onClick={openPwaHackCatalog}>
            More apps
            <DropdownMenuItemRightSlot>
              <Icon name="new_window" />
            </DropdownMenuItemRightSlot>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <a href={`${CONFIG.HOME_ORIGIN}/apps`} target="_blank">
              More apps
              <DropdownMenuItemRightSlot>
                <Icon name="new_window" />
              </DropdownMenuItemRightSlot>
            </a>
          </DropdownMenuItem>
        )}
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
        {!!isLoggedIn && (
          <DropdownMenuItem asChild>
            <a href={`${CONFIG.API_ORIGIN}/logout`}>
              Log out
              <DropdownMenuItemRightSlot>
                <Icon name="arrowRight" />
              </DropdownMenuItemRightSlot>
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
