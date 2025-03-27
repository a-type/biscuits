import { Button, ButtonProps, Icon } from '@a-type/ui';
import { ReactNode } from 'react';
import * as CONFIG from '../config.js';
import { useMaybeAppId } from './Context.js';

export interface LoginButtonProps extends ButtonProps {
	returnTo?: string;
	tab?: 'login' | 'signup';
}

export function LoginButton({ children, tab, ...props }: LoginButtonProps) {
	return (
		<Button asChild {...props}>
			<LoginLink tab={tab} returnTo={props.returnTo}>
				{children ?? (
					<>
						Log in
						<Icon name="arrowRight" />
					</>
				)}
			</LoginLink>
		</Button>
	);
}

export function LoginLink({
	children,
	tab,
	returnTo,
	...props
}: {
	returnTo?: string;
	tab?: 'login' | 'signup';
	children?: ReactNode;
	className?: string;
}) {
	const url = new URL(CONFIG.HOME_ORIGIN + '/login');

	url.searchParams.set('returnTo', returnTo ?? window.location.href);
	const appId = useMaybeAppId();
	if (appId) {
		url.searchParams.set('appReferrer', appId);
	}
	if (tab) {
		url.searchParams.set('tab', tab);
	}

	return (
		<a href={url.toString()} {...props}>
			{children ?? <>Log in</>}
		</a>
	);
}
