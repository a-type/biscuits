import { Button, ButtonProps, Icon } from '@a-type/ui';
import * as CONFIG from '../config.js';
import { useWasLoggedIn } from '../hooks/useWasLoggedIn.js';

export interface LogoutButtonProps extends ButtonProps {
	returnTo?: string;
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
	const url = new URL(CONFIG.API_ORIGIN + '/auth/logout');
	if (props.returnTo) {
		url.searchParams.set('returnTo', props.returnTo);
	}

	const [_, setWasLoggedIn] = useWasLoggedIn();

	return (
		<Button asChild {...props}>
			<a href={url.toString()} onClick={() => setWasLoggedIn(false)}>
				{children ?? (
					<>
						Log out
						<Icon name="arrowRight" />
					</>
				)}
			</a>
		</Button>
	);
}
