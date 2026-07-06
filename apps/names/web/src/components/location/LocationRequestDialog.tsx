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
import cls from './LocationRequestDialog.module.css';

const hasPermission = hasGeolocationPermission();

export function LocationRequestDialog() {
	const [, setHasDenied] = useHasDeniedGeolocation();
	const [beganDeny, setBeganDeny] = useState(false);
	const [hide, setHide] = useState(false);
	const { show } = useSnapshot(locationRequestDialogState);

	const allowed = use(hasPermission);

	const allow = async () => {
		await getGeolocation();
		try {
			if (await hasGeolocationPermission()) {
				setHide(true);
			} else {
				setBeganDeny(true);
			}
		} catch (err) {
			console.error(err);
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
			:	<Dialog.Content width="md">
					<Dialog.Title>Detect Location</Dialog.Title>
					<Box className={cls.graphic} gap="md">
						<div className={`${cls.iconWrapper} ${cls.leftIcon}`}>
							<Icon name="location" className={cls.icon} />
						</div>
						<div className={`${cls.iconWrapper} ${cls.rightIcon}`}>
							<Icon name="add_person" className={cls.icon} />
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
						<Button emphasis="primary" onClick={allow}>
							Grant access
						</Button>
					</Dialog.Actions>
				</Dialog.Content>
			}
		</Dialog>
	);
}
