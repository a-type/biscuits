import { graphql } from '@/graphql.js';
import { H2 } from '@a-type/ui/components/typography';
import { useMutation, useQuery } from 'urql';
import { FAMILY_STYLE_PRICE_ID, FOR_TWO_PRICE_ID } from '@/config.js';
import {
  CardGrid,
  CardMain,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import { Suspense } from 'react';
import { Price } from './Price.js';

export interface SubscriptionSelectProps {}

const CreatePlan = graphql(`
  mutation CreatePlan($input: SetupPlanInput!) {
    setupPlan(input: $input) {
      user {
        id
        plan {
          id
          checkoutData {
            subscriptionId
            clientSecret
          }
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
      <Suspense>
        <CardGrid>
          <SubscriptionChoiceButton
            disabled={result.fetching}
            onClick={() => selectPlan(FOR_TWO_PRICE_ID)}
            lookupKey="for_two"
          />
          <SubscriptionChoiceButton
            disabled={result.fetching}
            onClick={() => selectPlan(FAMILY_STYLE_PRICE_ID)}
            lookupKey="family_style"
          />
        </CardGrid>
      </Suspense>
    </div>
  );
}

const subscriptionPlanInfo = graphql(`
  query SubscriptionPlanInfo($lookupKey: String!) {
    productInfo(lookupKey: $lookupKey) {
      id
      price
      currency
      name
      description
    }
  }
`);

function SubscriptionChoiceButton({
  disabled,
  onClick,
  lookupKey,
}: {
  disabled: boolean;
  onClick: () => void;
  lookupKey: 'for_two' | 'family_style';
}) {
  const [{ data }] = useQuery({
    query: subscriptionPlanInfo,
    variables: { lookupKey },
  });
  return (
    <CardRoot>
      <CardMain asChild>
        <button onClick={onClick} disabled={disabled}>
          <CardTitle>{data?.productInfo.name}</CardTitle>
          <p>{data?.productInfo.description}</p>
          <Price
            value={data?.productInfo.price}
            currency={data?.productInfo.currency}
          />
        </button>
      </CardMain>
    </CardRoot>
  );
}
