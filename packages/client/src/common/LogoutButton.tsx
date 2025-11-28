import { Button, ButtonProps, Icon } from '@a-type/ui';
import { ReactNode } from 'react';
import * as CONFIG from '../config.js';
import { useWasLoggedIn } from '../hooks/useWasLoggedIn.js';
import { useIsLoggedIn } from '../react.js';

export interface LogoutButtonProps extends ButtonProps {
	returnTo?: string;
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
	const isLoggedIn = useIsLoggedIn();

	if (!isLoggedIn) {
		return null;
	}

	return (
		<Button asChild {...props}>
			<LogoutLink returnTo={props.returnTo}>
				{children ?? (
					<>
						Log out
						<Icon name="arrowRight" />
					</>
				)}
			</LogoutLink>
		</Button>
	);
}

export function LogoutLink({
	children,
	returnTo,
	...props
}: {
	returnTo?: string;
	children?: ReactNode;
	className?: string;
}) {
	const url = new URL(CONFIG.API_ORIGIN + '/auth/logout');
	if (returnTo) {
		url.searchParams.set('returnTo', returnTo);
	}

	const [_, setWasLoggedIn] = useWasLoggedIn();

	return (
		<a href={url.toString()} onClick={() => setWasLoggedIn(false)} {...props}>
			{children ?? <>Log out</>}
		</a>
	);
}
