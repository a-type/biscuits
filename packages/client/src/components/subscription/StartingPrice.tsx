import { useQuery } from '@biscuits/graphql';
import { graphql } from '../../graphql.js';
import { Price } from '../Price.js';

const startingPriceQuery = graphql(`
	query StartingPrice {
		productInfo(lookupKey: "for_one") {
			price
			currency
		}
	}
`);

export const StartingPrice = () => {
	const { data } = useQuery(startingPriceQuery);
	return (
		<Price
			value={data?.productInfo.price}
			currency={data?.productInfo.currency}
			className="font-bold"
		/>
	);
};
