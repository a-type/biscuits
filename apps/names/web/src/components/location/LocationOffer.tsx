import {
	hasLocationAbility,
	locationRequestDialogState,
	useHasDeniedGeolocation,
	useHasGeolocationPermission,
} from '@/services/location.js';
import { Button, ButtonProps, Icon } from '@a-type/ui';

export interface LocationOfferProps extends ButtonProps {
	overrideDeny?: boolean;
}

export function LocationOffer({ overrideDeny, ...rest }: LocationOfferProps) {
	const isAllowed = useHasGeolocationPermission();
	const [denied] = useHasDeniedGeolocation();

	if (isAllowed || !hasLocationAbility || (denied && !overrideDeny)) {
		return null;
	}

	return (
		<Button
			size="small"
			emphasis="ghost"
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
