import { API_HOST_HTTP } from '@/config';
import { FragmentOf, graphql, readFragment } from '@/graphql';
import { Button } from '@a-type/ui/components/button';
import { useSearchParams } from '@verdant-web/react-router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlanInfo, planProductInfo } from './PlanInfo';
import { CancelPlanButton } from './CancelPlanButton';
import classNames from 'classnames';
import { useQuery } from 'urql';
import { Icon } from '@a-type/ui/components/icon';
import { H2 } from '@a-type/ui/components/typography';

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

  const [_, refetchStatus] = useQuery({
    query: refetchPlanStatus,
    pause: true,
  });

  return (
    <div
      className={classNames('flex flex-col gap-4 items-start', className)}
      {...props}
    >
      <div>
        <H2>Your Subscription</H2>
        <div className="flex flex-row gap-3 items-center">
          Status: {data.subscriptionStatus}{' '}
          <Button
            size="icon"
            color="ghost"
            onClick={() => {
              refetchStatus({ networkPolicy: 'network-only' });
            }}
          >
            <Icon name="refresh" />
          </Button>
        </div>
        {data.productInfo && <PlanInfo data={data.productInfo} />}
      </div>
      <form action={`${API_HOST_HTTP}/stripe/portal-session`} method="POST">
        <Button type="submit">Change your subscription</Button>
        <span className="text-xs">
          Update your plan, change your card, or unsubscribe
        </span>
      </form>
      <CancelPlanButton />
    </div>
  );
}
