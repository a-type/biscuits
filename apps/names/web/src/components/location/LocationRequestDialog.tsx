import {
	getGeolocation,
	hasGeolocationPermission,
	hasLocationAbility,
	locationRequestDialogState,
	useHasDeniedGeolocation,
} from '@/services/location.js';
import { Box, Button, Dialog, Icon } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { use, useState } from 'react';
import { useSnapshot } from 'valtio';

const hasPermission = hasGeolocationPermission();

export function LocationRequestDialog() {
	const [, setHasDenied] = useHasDeniedGeolocation();
	const [beganDeny, setBeganDeny] = useState(false);
	const [hide, setHide] = useState(false);
	const { show } = useSnapshot(locationRequestDialogState);

	const allowed = use(hasPermission);

	const allow = async () => {
		await getGeolocation();
		if (await hasGeolocationPermission()) {
			setHide(true);
		} else {
			setBeganDeny(true);
		}
	};

	if (!show || allowed || !hasLocationAbility) return null;

	return (
		<Dialog open={!hide}>
			{beganDeny ?
				<Dialog.Content>
					<Dialog.Title>Location Denied</Dialog.Title>
					<Dialog.Description>
						You can change this later in the app settings.
					</Dialog.Description>
					<Dialog.Actions>
						<Button
							onClick={() => {
								setHasDenied(true);
								setBeganDeny(false);
								locationRequestDialogState.show = false;
							}}
						>
							Close
						</Button>
					</Dialog.Actions>
				</Dialog.Content>
			:	<Dialog.Content>
					<Dialog.Title>Detect Location</Dialog.Title>
					<Box className="relative h-40vmin bg-accentWash rounded-lg" gap="md">
						<div className="absolute left-3/8 z-1 top-1/2 translate--1/2 c-accentLight w-30vmin h-30vmin bg-overlay rounded-full flex items-center justify-center">
							<Icon name="location" className="w-20vmin h-20vmin" />
						</div>
						<div className="absolute left-5/8 z-2 top-1/2 translate--1/2 c-accentDark w-30vmin h-30vmin bg-overlay rounded-full flex items-center justify-center">
							<Icon name="add_person" className="w-20vmin h-20vmin" />
						</div>
					</Box>
					<Dialog.Description>
						<p>
							With your permission, this app can record your location when
							adding names, so you can search by where you met.
						</p>
						<p>
							This data is only used to provide features in this app, in
							accordance with the{' '}
							<Link to="https://biscuits.club/privacy" className="font-bold">
								Privacy Policy.
							</Link>
						</p>
					</Dialog.Description>
					<Dialog.Actions>
						<Button onClick={() => setBeganDeny(true)}>Deny</Button>
						<Button color="primary" onClick={allow}>
							Grant access
						</Button>
					</Dialog.Actions>
				</Dialog.Content>
			}
		</Dialog>
	);
}
