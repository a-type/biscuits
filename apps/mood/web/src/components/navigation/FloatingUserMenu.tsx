import { withClassName } from '@a-type/ui';
import { UserMenu } from '@biscuits/client/apps';

export const FloatingUserMenu = withClassName(
	UserMenu,
	'fixed top-sm right-sm bg-white border-default rounded-full shadow-md',
);
