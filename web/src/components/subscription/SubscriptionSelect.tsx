import { graphql } from '@/graphql.js';
import { H2 } from '@a-type/ui/components/typography';
import { useMutation, useQuery } from '@biscuits/client';
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
  const [createPlan, result] = useMutation(CreatePlan);

  const selectPlan = async (lookupKey: string) => {
    await createPlan({
      variables: {
        input: {
          priceLookupKey: lookupKey,
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <H2>Select a Plan</H2>
      <Suspense>
        <CardGrid>
          <SubscriptionChoiceButton
            disabled={result.loading}
            onClick={() => selectPlan('for_one')}
            lookupKey="for_one"
          />
          <SubscriptionChoiceButton
            disabled={result.loading}
            onClick={() => selectPlan('family_style')}
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
  lookupKey: 'for_one' | 'family_style';
}) {
  const { data } = useQuery(subscriptionPlanInfo, {
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
