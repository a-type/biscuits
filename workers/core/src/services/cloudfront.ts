import {
	CloudFront,
	CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';

export const cloudfront = new CloudFront();

export async function createInvalidation(
	distributionId: string,
	paths: string[],
) {
	const command = new CreateInvalidationCommand({
		DistributionId: distributionId,
		InvalidationBatch: {
			CallerReference: `biscuits-${Date.now()}`,
			Paths: {
				Quantity: paths.length,
				Items: paths,
			},
		},
	});

	return (cloudfront as any).send(command);
}
