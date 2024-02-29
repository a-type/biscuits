import { FragmentOf, graphql, readFragment } from '@/graphql';
import { Price } from './Price';
import { H2, H3, P } from '@a-type/ui/components/typography';

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
      <H3>{data.name}</H3>
      <P>{data.description}</P>
      <Price value={data.price} currency={data.currency} />
    </div>
  );
}
