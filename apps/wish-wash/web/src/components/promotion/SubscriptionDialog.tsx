import { Button } from '@a-type/ui/components/button';
import { Dialog } from '@a-type/ui/components/dialog';
import { P } from '@a-type/ui/components/typography';
import { CONFIG } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
import { ReactNode } from 'react';

export interface SubscriptionDialogProps {
  children: ReactNode;
}

export function SubscriptionDialog({ children }: SubscriptionDialogProps) {
  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Share your list for a year</Dialog.Title>
        <P className="gutter-bottom">
          For $10, share your list with friends and family all year. (That's
          your next birthday <i>and</i> yearly holidays sorted!)
        </P>
        <P>
          You'll get a link for any list you can share with people. They can
          browse and mark items as bought.
        </P>
        <Dialog.Actions>
          <Dialog.Close>Nevermind</Dialog.Close>
          <Button asChild color="primary">
            <Link
              to={`${CONFIG.HOME_ORIGIN}/login?tab=signup&appReferrer=wish-wash&appReturnTo=${encodeURIComponent('/buy-yearly')}`}
            >
              Subscribe
            </Link>
          </Button>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>
  );
}
