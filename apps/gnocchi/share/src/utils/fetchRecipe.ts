import { createServerFn } from '@tanstack/react-start';
import { notFound } from '@tanstack/router-core';
import { env } from 'cloudflare:workers';
import request from 'graphql-request';
import { recipePageQuery } from '~/components/RecipePage.js';
import { planIdMiddleware } from './planIdMiddleware.js';
import { proxyAuthMiddleware } from './proxyAuthMiddleware.js';

export const fetchRecipe = createServerFn()
	.inputValidator((data: { slug: string; planId?: string }) => data)
	.middleware([proxyAuthMiddleware, planIdMiddleware])
	.handler(async ({ context, data: { slug, planId: planOverride } }) => {
		const res = await request(
			`${env.API_ORIGIN}/graphql`,
			recipePageQuery,
			{
				planId: planOverride || context.planId,
				slug,
			},
			context.headers,
		);

		if (!res?.publicRecipe) {
			throw notFound();
		}

		return res.publicRecipe;
	});
