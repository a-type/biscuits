import { AppId, appIds } from '@biscuits/apps';
import Stripe from 'stripe';

interface BiscuitsProductMetadata {
	memberLimit: number;
	app: AppId | '*';
}

export async function getProductMetadata(
	productId: string,
	stripe: Stripe,
): Promise<BiscuitsProductMetadata> {
	const product = await stripe.products.retrieve(productId);
	const memberLimitStr = product.metadata?.memberLimit ?? '';
	let memberLimit: number = parseInt(memberLimitStr, 10);
	if (isNaN(memberLimit)) {
		memberLimit = 6;
	}
	let appId = product.metadata?.app ?? '*';
	if (!appIds.includes(appId as any)) {
		appId = '*';
	}
	return {
		memberLimit,
		app: appId as AppId | '*',
	};
}
