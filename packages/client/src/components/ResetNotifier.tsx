import { useContext, useEffect, useState } from 'react';
import { VerdantContext } from '../verdant.js';
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { P } from '@a-type/ui/components/typography';
import { Button } from '@a-type/ui/components/button';

export interface ResetNotifierProps {}

export function ResetNotifier({}: ResetNotifierProps) {
  const [shown, setShown] = useState(false);
  const clientDesc = useContext(VerdantContext);
  useEffect(() => {
    if (!clientDesc?.current) return;
    const client = clientDesc.current;
    return client.subscribe('resetToServer', () => {
      setShown(true);
    });
  }, [clientDesc]);

  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    if (shown) {
      setWaiting(true);
      const timeout = setTimeout(() => {
        setWaiting(false);
        setShown(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [shown]);

  return (
    <Dialog open={shown} onOpenChange={setShown}>
      <DialogContent>
        <DialogTitle>Catching up...</DialogTitle>
        <P>
          It's been a while since you've used this app. Fetching the latest data
          from the server!
        </P>
        <DialogActions>
          <DialogClose asChild>
            <Button loading={waiting}>Ok</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
