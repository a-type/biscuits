import { Avatar } from '@a-type/ui/components/avatar';
import { Button } from '@a-type/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemRightSlot,
  DropdownMenuTrigger,
} from '@a-type/ui/components/dropdownMenu';
import { CONFIG, graphql, useIsLoggedIn, useMe, useQuery } from '../index.js';
import { Icon } from '@a-type/ui/components/icon';

export interface UserMenuProps {
  className?: string;
  disableAppSettings?: boolean;
}

export function UserMenu({ className, disableAppSettings }: UserMenuProps) {
  const isLoggedIn = useIsLoggedIn();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" color="ghost" className={className}>
          <UserAvatar skipFetch={!isLoggedIn} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!isLoggedIn ? (
          <DropdownMenuItem
            asChild
            className="theme-leek bg-primary-wash color-primary-dark"
          >
            <a href={`${CONFIG.HOME_ORIGIN}/join`}>
              Upgrade for sync
              <DropdownMenuItemRightSlot>
                <Icon name="gift" />
              </DropdownMenuItemRightSlot>
            </a>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <a href={`${CONFIG.HOME_ORIGIN}/plan`}>
              Mange plan
              <DropdownMenuItemRightSlot>
                <Icon name="profile" />
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
        <DropdownMenuItem asChild>
          <a href={`${CONFIG.API_ORIGIN}/logout`}>
            Logout
            <DropdownMenuItemRightSlot>
              <Icon name="arrowRight" />
            </DropdownMenuItemRightSlot>
          </a>
        </DropdownMenuItem>
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
  const [result] = useQuery({ query: userAvatarQuery, pause: skipFetch });

  return (
    <Avatar
      imageSrc={result?.data?.me?.imageUrl ?? undefined}
      className={className}
    />
  );
}
