import { proxy } from 'valtio';
import { useSnapshot } from 'valtio';
import { LoginButton } from './LoginButton.js';
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { Button } from '@a-type/ui/components/button';
import { ReactNode } from 'react';
import { Icon } from '@a-type/ui/components/icon';
import { graphql, useQuery } from '../index.js';

const subscriptionPromotionState = proxy({
  status: 'closed' as 'closed' | 'open',
});

export function showSubscriptionPromotion() {
  subscriptionPromotionState.status = 'open';
}

export interface SubscriptionPromotionProps {
  children: ReactNode;
}

const promotionProductQuery = graphql(`
  query PromotionProduct {
    productInfo(lookupKey: "for_two") {
      id
      price
      currency
    }
  }
`);

export function SubscriptionPromotion({
  children,
}: SubscriptionPromotionProps) {
  const { status } = useSnapshot(subscriptionPromotionState);
  const { data } = useQuery(promotionProductQuery);
  const price = data?.productInfo.price;
  const currency = data?.productInfo.currency;

  return (
    <Dialog
      open={status !== 'closed'}
      onOpenChange={(open) => {
        if (!open) {
          subscriptionPromotionState.status = 'closed';
        }
      }}
    >
      <DialogContent width="lg">
        <div className="flex flex-row items-start gap-2">
          <DialogTitle className="flex-1">
            Upgrade for sync &amp; more
          </DialogTitle>
          <DialogClose asChild>
            <Button size="small" color="ghost">
              <Icon name="x" />
            </Button>
          </DialogClose>
        </div>
        {children}
        <DialogActions>
          <div className="flex flex-col gap-2 items-center m-auto mt-1">
            <LoginButton
              color="primary"
              returnTo="/"
              onClick={() => (subscriptionPromotionState.status = 'closed')}
            >
              Join the club
            </LoginButton>
            <span className="text-xs">
              Starting at {price} {currency} / month. 14 days free.
            </span>
          </div>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
