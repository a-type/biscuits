import {
	hooks,
	useAddLocation,
	useAddRelationship,
	useJustAddedPeople,
	useRelationshipSuggestions,
} from '@/hooks.js';
import { useHasGeolocationPermission } from '@/services/location.js';
import { Button, clsx, HorizontalList, Icon } from '@a-type/ui';
import { Person } from '@names.biscuits/verdant';
import { useState } from 'react';

export interface PersonQuickActionsProps {
	className?: string;
	person: Person;
}

export function PersonQuickActions({
	className,
	person,
}: PersonQuickActionsProps) {
	const {
		geolocation,
		id: personId,
		dismissedSuggestions,
	} = hooks.useWatch(person);
	// existing relationships are omitted.
	const existingRelationships = hooks.useAllRelationships({
		index: {
			where: 'personId',
			equals: personId,
		},
	});
	const omit = existingRelationships.flatMap((r) => [
		r.get('personAId'),
		r.get('personBId'),
	]);
	const relationshipSuggestions = useRelationshipSuggestions(person);
	const recentlyAdded = useJustAddedPeople();
	// if this person was recently added, show location attach action
	const locationEnabled = useHasGeolocationPermission();
	const showAttachLocation =
		!geolocation && locationEnabled && recentlyAdded.some((p) => p === person);
	const addRelationship = useAddRelationship();
	const [addLocation, addingLocation] = useAddLocation();
	const [open, setOpen] = useState(true);

	return (
		<HorizontalList
			open={open}
			onOpenChange={setOpen}
			className={clsx('gap-0 items-center', className)}
		>
			{showAttachLocation && (
				<Button
					size="small"
					loading={addingLocation}
					onClick={() => addLocation(person)}
					color="accent"
					className="font-normal my-auto"
				>
					<Icon name="location" />
					Attach current location
				</Button>
			)}
			{recentlyAdded.map((recentPerson) => {
				if (recentPerson === person) return null;
				if (omit.includes(recentPerson.get('id'))) return null;
				return (
					<Button
						size="small"
						onClick={() => addRelationship(personId, recentPerson.get('id'))}
						color="default"
						className="font-normal my-auto"
					>
						<Icon name="clock" />
						Connect with {recentPerson.get('name')}
					</Button>
				);
			})}
			{relationshipSuggestions.map((relatedPerson) => {
				if (relatedPerson === person) return null;
				if (recentlyAdded.includes(relatedPerson)) return null; // no dupes
				if (omit.includes(relatedPerson.get('id'))) return null;
				return (
					<Button
						key={relatedPerson.get('id')}
						size="small"
						color="default"
						asChild
					>
						<div className="p-0 gap-0 my-auto">
							<Button
								color="ghost"
								size="small"
								className="border-0 font-normal"
								onClick={() =>
									addRelationship(personId, relatedPerson.get('id'))
								}
							>
								<Icon name="connection" />
								Connect with {relatedPerson.get('name')}
							</Button>
							<Button
								size="icon-small"
								color="ghostDestructive"
								onClick={() =>
									dismissedSuggestions.add(relatedPerson.get('id'))
								}
								className="border-0"
							>
								<Icon name="x" />
							</Button>
						</div>
					</Button>
				);
			})}
		</HorizontalList>
	);
}
