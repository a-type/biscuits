import { hooks } from '@/hooks.js';
import { useHasGeolocationPermission } from '@/services/location.js';
import { Box, Button, CollapsibleSimple, Icon } from '@a-type/ui';
import { useSessionStorage } from '@biscuits/client';
import { useSuperBar } from './SuperBarContext.jsx';

export interface SuperBarCreateProps {}

export function SuperBarCreate({}: SuperBarCreateProps) {
	const {
		inputValue,
		createNew,
		loading,
		addRelationshipToCurrentPerson,
		setAddRelationshipToCurrentPerson,
		relateTo,
	} = useSuperBar();

	const locationEnabled = useHasGeolocationPermission();
	const [attachLocation, setAttachLocation] = useSessionStorage(
		'attachLocation',
		true,
	);

	const showExtras = locationEnabled || relateTo.length > 0;

	return (
		<CollapsibleSimple open={!!inputValue} className="w-full">
			<Box d="col" gap="xs" surface="primary" className="rounded-none">
				<Button
					color="ghost"
					className="w-full justify-center text-wrap rounded-none justify-between gap-sm [--focus:var(--color-primary-dark)]"
					loading={loading}
					onClick={() => {
						createNew({ attachLocation });
					}}
				>
					Create "{inputValue}"
					<Icon name="enterKey" className="ml-auto" />
				</Button>
				{showExtras && (
					<Box gap="sm" p="sm" wrap layout="center start">
						{locationEnabled && (
							<Button
								size="small"
								color="primary"
								toggleMode="color"
								toggled={attachLocation}
								onClick={() => setAttachLocation(!attachLocation)}
							>
								<Icon name={attachLocation ? 'x' : 'check'} />
								{attachLocation ? 'Current' : 'Add'} location
							</Button>
						)}
						{relateTo.length > 0 && (
							<AddRelationshipToPersonToggle
								toggled={addRelationshipToCurrentPerson}
								onToggledChange={setAddRelationshipToCurrentPerson}
								personId={relateTo[0]}
							/>
						)}
					</Box>
				)}
			</Box>
		</CollapsibleSimple>
	);
}

function AddRelationshipToPersonToggle({
	personId,
	toggled,
	onToggledChange,
}: {
	personId: string;
	toggled: boolean;
	onToggledChange: (v: boolean) => void;
}) {
	const person = hooks.usePerson(personId);
	hooks.useWatch(person);

	if (!person) return null;

	return (
		<Button
			size="small"
			color="primary"
			toggled={toggled}
			toggleMode="color"
			onClick={() => onToggledChange(!toggled)}
		>
			<Icon name={toggled ? 'x' : 'plus'} />
			Relate{toggled ? 'd' : ''} to {person.get('name')}
		</Button>
	);
}
