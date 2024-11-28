import { Button, ButtonProps, Icon } from '@a-type/ui';
import * as CONFIG from '../config.js';
import { useMaybeAppId } from './Context.js';

export interface LoginButtonProps extends ButtonProps {
	returnTo?: string;
}

export function LoginButton({ children, ...props }: LoginButtonProps) {
	const url = new URL(CONFIG.HOME_ORIGIN + '/login');

	url.searchParams.set('returnTo', props.returnTo ?? window.location.href);
	const appId = useMaybeAppId();
	if (appId) {
		url.searchParams.set('appReferrer', appId);
	}

	return (
		<Button asChild {...props}>
			<a href={url.toString()}>
				{children ?? (
					<>
						Log in
						<Icon name="arrowRight" />
					</>
				)}
			</a>
		</Button>
	);
}
