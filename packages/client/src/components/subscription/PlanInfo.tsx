import { H3, P } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '../../graphql.js';
import { Price } from '../Price.js';

export const planProductInfo = graphql(`
	fragment PlanInfo_productInfo on ProductInfo {
		id
		price
		currency
		name
		description
		period
	}
`);

export interface PlanInfoProps {
	data: FragmentOf<typeof planProductInfo>;
}

export function PlanInfo({ data: $data }: PlanInfoProps) {
	const data = readFragment(planProductInfo, $data);
	return (
		<div>
			<H3 className="text-sm">{data.name}</H3>
			<P>{data.description}</P>
			<Price value={data.price} currency={data.currency} period={data.period} />
		</div>
	);
}
