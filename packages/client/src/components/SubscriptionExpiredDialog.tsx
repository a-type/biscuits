import { Dialog, DialogContent } from '@a-type/ui/components/dialog';
import { H2 } from '@a-type/ui/components/typography';
import { LogoutButton, ManagePlanButton, useMe } from '../index.js';

export interface SubscriptionExpiredDialogProps {}

export function SubscriptionExpiredDialog({}: SubscriptionExpiredDialogProps) {
  const { data } = useMe();
  const isLoggedIn = !!data?.me;
  const subscriptionStatus = data?.me?.plan?.subscriptionStatus;

  const open = isLoggedIn && subscriptionStatus === 'expired';

  return (
    <Dialog open={open}>
      <DialogContent>
        <H2>Subscription expired</H2>
        <p>
          Looks like you either cancelled your subscription, or your payment
          didn&apos;t go through. To keep using sync, please check your card
          details.
        </p>
        <ManagePlanButton />
        <p>
          If you intended to cancel your subscription, log out to dismiss this
          message.
        </p>
        <LogoutButton>Log out</LogoutButton>
      </DialogContent>
    </Dialog>
  );
}
