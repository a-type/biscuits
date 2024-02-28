import { FragmentOf, graphql, readFragment } from '@/graphql';
import { useQuery } from 'urql';

export const planProductInfo = graphql(`
  fragment PlanInfo_productInfo on ProductInfo {
    id
    price
    currency
    name
    description
  }
`);

export interface PlanInfoProps {
  data: FragmentOf<typeof planProductInfo>;
}

export function PlanInfo({ data: $data }: PlanInfoProps) {
  const data = readFragment(planProductInfo, $data);
  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.description}</p>
      <p>
        {((data.price ?? 0) / 100).toFixed(2)} {data.currency} / month
      </p>
    </div>
  );
}

const autoPlanInfo = graphql(
  `
    query AutoPlanInfo($priceId: String!) {
      productInfo(priceId: $priceId) {
        id
        ...PlanInfo_productInfo
      }
    }
  `,
  [planProductInfo],
);

export function AutoPlanInfo({ priceId }: { priceId: string }) {
  const [{ data }] = useQuery({ query: autoPlanInfo, variables: { priceId } });

  if (!data?.productInfo) return null;

  return <PlanInfo data={data?.productInfo} />;
}
