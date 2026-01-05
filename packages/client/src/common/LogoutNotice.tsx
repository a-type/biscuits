import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	P,
} from '@a-type/ui';
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
			<DialogContent>
				<DialogTitle>Session expired</DialogTitle>
				<P>To resume syncing your data, please sign in again.</P>
				<div className="flex flex-row gap-3 justify-end items-center">
					<DialogClose render={<Button emphasis="ghost" />}>Cancel</DialogClose>
					<DialogClose
						render={
							<LoginButton emphasis="primary" onClick={() => setClose(true)} />
						}
					>
						Sign in
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
