import { Button, ButtonProps } from '@a-type/ui';
import { ReactNode } from 'react';

export function OAuthSigninButton({
	returnTo,
	children,
	className,
	inviteId,
	endpoint,
	appState,
	...rest
}: {
	returnTo?: string | null;
	children?: ReactNode;
	inviteId?: string | null;
	endpoint: string;
	appState?: any;
} & ButtonProps) {
	const url = new URL(endpoint ?? window.location.origin);
	if (returnTo) {
		url.searchParams.set('returnTo', returnTo);
	}
	if (inviteId) {
		url.searchParams.set('inviteId', inviteId);
	}
	if (appState) {
		url.searchParams.set('appState', JSON.stringify(appState));
	}

	return (
		<form action={url.toString()} className={className} method="post">
			<Button type="submit" {...rest}>
				{children}
			</Button>
		</form>
	);
}
