import { useHasGeolocationPermission } from '@/services/location.js';
import { Box, Button, Checkbox, CollapsibleSimple, Icon } from '@a-type/ui';
import { useSessionStorage } from '@biscuits/client';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarCreateProps {}

export function SuperBarCreate({}: SuperBarCreateProps) {
	const { inputValue, createNew, loading } = useSuperBar();

	const locationEnabled = useHasGeolocationPermission();
	const [attachLocation, setAttachLocation] = useSessionStorage(
		'attachLocation',
		true,
	);

	return (
		<CollapsibleSimple open={!!inputValue} className="w-full">
			<Box d="col" gap="xs" surface="primary" className="rounded-none">
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
		</CollapsibleSimple>
	);
}
