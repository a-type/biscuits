import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	P,
} from '@a-type/ui';
import { useContext, useEffect, useState } from 'react';
import { VerdantContext } from '../verdant.js';

export interface ResetNotifierProps {}

export function ResetNotifier({}: ResetNotifierProps) {
	const [shown, setShown] = useState(false);
	const client = useContext(VerdantContext);
	useEffect(() => {
		return client?.subscribe('resetToServer', () => {
			setShown(true);
		});
	}, [client]);

	const [waiting, setWaiting] = useState(false);
	useEffect(() => {
		if (shown) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setWaiting(true);
			const timeout = setTimeout(() => {
				setWaiting(false);
				setShown(false);
			}, 5000);
			return () => clearTimeout(timeout);
		}
	}, [shown]);

	return (
		<Dialog open={shown} onOpenChange={setShown}>
			<DialogContent>
				<DialogTitle>Catching up...</DialogTitle>
				<P>
					It's been a while since you've used this app. Fetching the latest data
					from the server!
				</P>
				<DialogActions>
					<DialogClose render={<Button loading={waiting} />}>Ok</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
