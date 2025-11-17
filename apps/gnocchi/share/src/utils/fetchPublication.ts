import { graphql } from '@biscuits/graphql';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';
import { publicationPageFragment } from '~/components/PublicationPage.js';
import { planIdMiddleware } from './planIdMiddleware.js';
import { proxyAuthMiddleware } from './proxyAuthMiddleware.js';

const publicationQuery = graphql(
	`
		query FetchPublication($planId: ID!) {
			publicRecipePublication(planId: $planId) {
				id
				...PublicationPage
			}
		}
	`,
	[publicationPageFragment],
);

export const fetchPublication = createServerFn()
	.inputValidator((data: { planId?: string }) => data)
	.middleware([proxyAuthMiddleware, planIdMiddleware])
	.handler(async ({ context, data: { planId: planOverride } }) => {
		const res = await request(
			`${env.API_ORIGIN}/graphql`,
			publicationQuery,
			{
				planId: planOverride || context.planId,
			},
			context.headers,
		);

		if (!res?.publicRecipePublication) {
			throw notFound();
		}

		return res.publicRecipePublication;
	});
