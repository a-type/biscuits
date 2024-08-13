import { graphql } from '../../graphql.js';
import { H2, P } from '@a-type/ui/components/typography';
import { useMutation, useQuery } from '@apollo/client';
import {
  CardContent,
  CardGrid,
  CardMain,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import { Suspense } from 'react';
import { Price } from '../Price.js';
import { Button } from '@a-type/ui/components/button';

export interface SubscriptionSelectProps {
  priceKeys?: PriceKey[];
}

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

export type PriceKey = 'for_one' | 'family_style' | 'wishwash_yearly';
const defaultPriceKeys: PriceKey[] = ['for_one', 'family_style'];

export function SubscriptionSelect({
  priceKeys = defaultPriceKeys,
}: SubscriptionSelectProps) {
  const [createPlan, result] = useMutation(CreatePlan, {
    refetchQueries: ['PlanSubscriptionInfo'],
  });

  const selectPlan = async (lookupKey: string) => {
    await createPlan({
      variables: {
        input: {
          priceLookupKey: lookupKey,
        },
      },
    });
  };

  // only one key ... show a different experience
  if (priceKeys.length === 1) {
    return (
      <SinglePriceExperience
        priceKey={priceKeys[0]}
        onProceed={() =>
          createPlan({
            variables: { input: { priceLookupKey: priceKeys[0] } },
          })
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <H2>Select a Plan</H2>
      <Suspense>
        <CardGrid>
          {priceKeys.map((lookupKey) => (
            <SubscriptionChoiceButton
              key={lookupKey}
              disabled={result.loading}
              onClick={() => selectPlan(lookupKey)}
              lookupKey={lookupKey as PriceKey}
            />
          ))}
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
  lookupKey: PriceKey;
}) {
  const { data } = useQuery(subscriptionPlanInfo, {
    variables: { lookupKey },
  });
  return (
    <CardRoot>
      <CardMain asChild>
        <button onClick={onClick} disabled={disabled}>
          <CardTitle>{data?.productInfo.name}</CardTitle>
          <CardContent>{data?.productInfo.description}</CardContent>
          <CardContent>
            <Price
              value={data?.productInfo.price}
              currency={data?.productInfo.currency}
            />
          </CardContent>
        </button>
      </CardMain>
    </CardRoot>
  );
}

function SinglePriceExperience({
  priceKey,
  onProceed,
}: {
  priceKey: PriceKey;
  onProceed: () => void;
}) {
  const { data } = useQuery(subscriptionPlanInfo, {
    variables: { lookupKey: priceKey },
  });

  return (
    <div className="flex flex-col gap-3 items-start">
      <H2>Checkout</H2>
      <P>
        You're about to subscribe to {data?.productInfo.name} for{' '}
        <Price
          value={data?.productInfo.price}
          currency={data?.productInfo.currency}
        />
        .
      </P>
      <Button color="primary" onClick={onProceed}>
        Enter payment info
      </Button>
    </div>
  );
}
