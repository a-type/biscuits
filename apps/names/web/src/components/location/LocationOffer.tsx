import {
	hasLocationAbility,
	locationRequestDialogState,
	useHasDeniedGeolocation,
	useHasGeolocationPermission,
} from '@/services/location.js';
import { Button, ButtonProps, Icon } from '@a-type/ui';
import { useHasServerAccess } from '@biscuits/client';

export interface LocationOfferProps extends ButtonProps {
	overrideDeny?: boolean;
}

export function LocationOffer({ overrideDeny, ...rest }: LocationOfferProps) {
	const isAllowed = useHasGeolocationPermission();
	const [denied] = useHasDeniedGeolocation();
	const isSubscribed = useHasServerAccess();

	if (
		isAllowed ||
		!hasLocationAbility ||
		(denied && !overrideDeny) ||
		!isSubscribed
	) {
		return null;
	}

	return (
		<Button
			size="small"
			color="ghost"
			{...rest}
			onClick={() => {
				locationRequestDialogState.show = true;
			}}
		>
			<Icon name="location" />
			<span>Enable location search</span>
		</Button>
	);
}
