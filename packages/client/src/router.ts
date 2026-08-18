import { GlobalErrorFallback } from '@a-type/ui';
import type { RouterConstructorOptions } from '@tanstack/react-router';

export const commonRouterConfig: Partial<
	RouterConstructorOptions<any, any, any, any, any>
> = {
	scrollToTopSelectors: ['#page--main-content'],
	scrollRestoration: true,
	defaultPreload: 'intent',
	defaultErrorComponent: GlobalErrorFallback,
	defaultViewTransition: true,
};
