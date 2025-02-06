import { useHasGeolocationPermission } from '@/services/location.js';
import { Box, Button, Checkbox, Icon } from '@a-type/ui';
import { useState } from 'react';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarCreateProps {}

export function SuperBarCreate({}: SuperBarCreateProps) {
	const { inputValue, createNew, loading } = useSuperBar();

	const locationEnabled = useHasGeolocationPermission();
	const [attachLocation, setAttachLocation] = useState(true);

	if (!inputValue) return null;

	return (
		<Box
			d="col"
			gap="xs"
			surface="primary"
			border
			className="shadow-md w-full overflow-hidden animate-pop-up animate-duration-200 lg:(w-auto min-w-300px max-w-100% self-center)"
		>
			<Button
				color="ghost"
				className="w-full justify-center text-wrap rounded-none justify-between gap-sm [--focus:var(--color-primary-dark)]"
				loading={loading}
				onClick={() => createNew({ attachLocation })}
			>
				Create "{inputValue}"
				<Icon name="enterKey" className="ml-auto" />
			</Button>
			{locationEnabled && (
				<Box gap="sm" p="sm" layout="center start" asChild>
					<label>
						<Checkbox
							checked={attachLocation}
							onCheckedChange={(v) => setAttachLocation(!!v)}
						/>
						<span>Attach location</span>
					</label>
				</Box>
			)}
		</Box>
	);
}
