import { graphql } from '@/graphql';
import { H2 } from '@a-type/ui/components/typography';
import { withClassName } from '@a-type/ui/hooks';
import { useMutation } from 'urql';

const FOR_TWO_PRICE_ID = import.meta.env.VITE_STRIPE_FOR_TWO_PLAN_PRICE_ID;
const FAMILY_STYLE_PRICE_ID = import.meta.env.VITE_STRIPE_FAMILY_PLAN_PRICE_ID;

export interface SubscriptionSelectProps {}

const CreatePlan = graphql(`
  mutation CreatePlan($input: SetupPlanInput!) {
    setupPlan(input: $input) {
      plan {
        id
        checkoutData {
          subscriptionId
          clientSecret
        }
      }
    }
  }
`);

export function SubscriptionSelect({}: SubscriptionSelectProps) {
  const [result, createPlan] = useMutation(CreatePlan);

  const selectPlan = async (priceId: string) => {
    await createPlan({
      input: {
        stripePriceId: priceId,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <H2>Select a Plan</H2>
      <div className="flex flex-row gap-4">
        <SubscriptionChoiceButton
          disabled={result.fetching}
          onClick={() => selectPlan(FOR_TWO_PRICE_ID)}
        >
          For Two
        </SubscriptionChoiceButton>
        <SubscriptionChoiceButton
          disabled={result.fetching}
          onClick={() => selectPlan(FAMILY_STYLE_PRICE_ID)}
        >
          Family Style
        </SubscriptionChoiceButton>
      </div>
    </div>
  );
}

const SubscriptionChoiceButton = withClassName('button', 'p-6');
