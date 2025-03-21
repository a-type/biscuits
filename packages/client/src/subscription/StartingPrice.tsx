import { graphql, useQuery } from '@biscuits/graphql';
import { Price } from '../common/Price.js';

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
