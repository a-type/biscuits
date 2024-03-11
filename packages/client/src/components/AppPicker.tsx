import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@a-type/ui/components/popover';
import { CONFIG } from '../index.js';
import { ReactNode, useEffect } from 'react';
import { apps } from '@biscuits/apps';
import {
  NavBarItem,
  NavBarItemIcon,
  NavBarItemIconWrapper,
  NavBarItemText,
} from '@a-type/ui/components/navBar';

export interface AppPickerProps {
  className?: string;
  children?: ReactNode;
}

export function AppPicker({ className, children }: AppPickerProps) {
  // listen for iframeMessages to trigger app navigation
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin === CONFIG.HOME_ORIGIN) {
        const { type, payload } = JSON.parse(event.data);
        if (type === 'navigate') {
          const appId = payload.appId;
          const app = apps.find((app) => app.id === appId);
          if (app) {
            window.location.href = import.meta.env.DEV
              ? app.devOriginOverride
              : app.url;
          }
        }
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return (
    <Popover>
      <PopoverTrigger className={className} asChild>
        {children ?? (
          <Button size="icon" color="ghost">
            <Icon name="cardsGrid" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" side="top" className="p-0">
        <iframe
          className="w-[152px] h-[152px] p-0 border-none shadow-none"
          src={`${CONFIG.HOME_ORIGIN}/appPicker/`}
          title="App Picker"
        />
      </PopoverContent>
    </Popover>
  );
}

export function AppPickerNavItem({ className }: { className?: string }) {
  return (
    <AppPicker>
      <NavBarItem>
        <NavBarItemIconWrapper>
          <Icon name="cardsGrid" />
        </NavBarItemIconWrapper>
        <NavBarItemText>Apps</NavBarItemText>
      </NavBarItem>
    </AppPicker>
  );
}
