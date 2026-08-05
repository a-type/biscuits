import { Box, Button, Dialog, P } from '@a-type/ui';
import { useEffect, useState } from 'react';
import { useIsLoggedIn } from '../hooks/graphql.js';
import { useWasLoggedIn } from '../hooks/useWasLoggedIn.js';
import { LoginButton } from './LoginButton.js';

export interface LogoutNoticeProps {}

export function LogoutNotice({}: LogoutNoticeProps) {
	const [wasLoggedIn, setWasLoggedIn] = useWasLoggedIn();
	const [isLoggedIn, loadingLoggedInStatus] = useIsLoggedIn();
	const [close, setClose] = useState(false);

	const isLoginPage =
		window.location.pathname === '/login' ||
		window.location.pathname === '/verify';

	const wasLoggedInButNowLoggedOut =
		!close && wasLoggedIn && !isLoggedIn && !loadingLoggedInStatus;

	// only want to fire this when session changes, not when flag changes.
	// flag can be reset manually.
	useEffect(() => {
		if (isLoggedIn) {
			setWasLoggedIn(true);
		}
	}, [isLoggedIn, setWasLoggedIn]);

	if (isLoginPage) return null;

	return (
		<Dialog open={wasLoggedInButNowLoggedOut} onOpenChange={setWasLoggedIn}>
			<Dialog.Content>
				<Dialog.Title>Session expired</Dialog.Title>
				<P>To resume syncing your data, please sign in again.</P>
				<Box items="center" justify="end" gap="sm">
					<Dialog.Close render={<Button emphasis="ghost" />}>
						Cancel
					</Dialog.Close>
					<Dialog.Close
						render={
							<LoginButton emphasis="primary" onClick={() => setClose(true)} />
						}
					>
						Sign in
					</Dialog.Close>
				</Box>
			</Dialog.Content>
		</Dialog>
	);
}
