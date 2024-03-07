import { useLocalStorage } from '../hooks/useStorage.js';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { P } from '@a-type/ui/components/typography';
import { Button } from '@a-type/ui/components/button';
import { useIsLoggedIn } from '../index.js';
import { LoginButton } from './LoginButton.js';

export interface LogoutNoticeProps {}

export function LogoutNotice({}: LogoutNoticeProps) {
  const [wasLoggedIn, setWasLoggedIn] = useLocalStorage('wasLoggedIn', false);
  const isLoggedIn = useIsLoggedIn();
  const [close, setClose] = useState(false);

  const wasLoggedInButNowLoggedOut = !close && wasLoggedIn && !isLoggedIn;

  // only want to fire this when session changes, not when flag changes.
  // flag can be reset manually.
  useEffect(() => {
    if (isLoggedIn) {
      setWasLoggedIn(true);
    }
  }, [isLoggedIn]);

  return (
    <Dialog open={wasLoggedInButNowLoggedOut} onOpenChange={setWasLoggedIn}>
      <DialogContent>
        <DialogTitle>Session expired</DialogTitle>
        <P>To resume syncing your data, please sign in again.</P>
        <div className="flex flex-row gap-3 justify-end items-center">
          <DialogClose asChild>
            <Button color="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <LoginButton color="primary" onClick={() => setClose(true)}>
              Sign in
            </LoginButton>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
