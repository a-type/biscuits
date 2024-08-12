import { FragmentOf, graphql, readFragment } from '../../graphql.js';
import { Button } from '@a-type/ui/components/button';
import { useSearchParams } from '@verdant-web/react-router';
import { useEffect } from 'react';
import { toast, clsx } from '@a-type/ui';
import { PlanInfo, planProductInfo } from './PlanInfo.js';
import { CancelPlanButton } from './CancelPlanButton.js';
import { useLazyQuery } from '@apollo/client';
import { Icon } from '@a-type/ui/components/icon';
import { H2 } from '@a-type/ui/components/typography';
import * as CONFIG from '../../config.js';

export const manageSubscriptionInfo = graphql(
  `
    fragment ManageSubscription_manageSubscriptionInfo on Plan {
      id
      subscriptionStatus
      productInfo {
        id
        ...PlanInfo_productInfo
      }
    }
  `,
  [planProductInfo],
);

const refetchPlanStatus = graphql(`
  query RefetchPlanStatus {
    plan {
      id
      subscriptionStatus
    }
  }
`);

export interface ManageSubscriptionProps {
  className?: string;
  data: FragmentOf<typeof manageSubscriptionInfo>;
}

export function ManageSubscription({
  className,
  data: $data,
  ...props
}: ManageSubscriptionProps) {
  const [params, setParams] = useSearchParams();

  const data = readFragment(manageSubscriptionInfo, $data);

  useEffect(() => {
    if (params.get('paymentComplete')) {
      toast.success('Your subscription is activated! 🎉');
      setParams((p) => {
        p.delete('paymentComplete');
        return p;
      });
    }
  }, [params, setParams]);

  const [refetchStatus] = useLazyQuery(refetchPlanStatus);

  return (
    <div
      className={clsx('flex flex-col gap-4 items-start', className)}
      {...props}
    >
      <div className="flex flex-col gap-4">
        <H2>Your Subscription</H2>
        <div
          className={clsx(
            'flex flex-row gap-3 items-center self-start p-2 rounded',
            {
              'bg-accent-wash': data.subscriptionStatus === 'active',
              'bg-primary-wash': data.subscriptionStatus === 'trialing',
              'bg-attention-wash': ['cancelled', 'past_due'].includes(
                data.subscriptionStatus,
              ),
            },
          )}
        >
          Status: {data.subscriptionStatus}{' '}
          <Button
            size="icon"
            color="ghost"
            onClick={() => {
              refetchStatus({ fetchPolicy: 'network-only' });
            }}
          >
            <Icon name="refresh" />
          </Button>
        </div>
        {data.productInfo && <PlanInfo data={data.productInfo} />}
      </div>
      <form action={`${CONFIG.API_ORIGIN}/stripe/portal-session`} method="POST">
        <Button type="submit">Change your subscription</Button>
        <span className="text-xs">
          Update your plan, change your card, or unsubscribe
        </span>
      </form>
      <CancelPlanButton />
    </div>
  );
}
