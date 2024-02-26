import { API_HOST_HTTP } from '@/config';
import { FragmentOf, graphql, readFragment } from '@/graphql';
import { Button } from '@a-type/ui/components/button';
import { useSearchParams } from '@verdant-web/react-router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlanInfo, planProductInfo } from './PlanInfo';

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

  return (
    <div className={className} {...props}>
      <div>
        <h2>Your Subscription</h2>
        <p>Status: {data.subscriptionStatus}</p>
        {data.productInfo && <PlanInfo data={data.productInfo} />}
      </div>
      <form action={`${API_HOST_HTTP}/stripe/portal-session`} method="POST">
        <Button type="submit">Change your subscription</Button>
        <span className="text-xs">
          Update your plan, change your card, or unsubscribe
        </span>
      </form>
    </div>
  );
}
