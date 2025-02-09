import { hooks } from '@/hooks.js';
import {
	distance,
	LOCATION_BROAD_SEARCH_RADIUS,
	useGeolocation,
} from '@/services/location.js';
import {
	Avatar,
	Box,
	clsx,
	Divider,
	EditableText,
	Icon,
	LiveUpdateTextField,
	RelativeTime,
} from '@a-type/ui';
import { useUserInfo } from '@biscuits/client';
import { Person } from '@names.biscuits/verdant';
import { PersonPhoto } from './PersonPhoto.jsx';
import { PersonRelationships } from './PersonRelationships.jsx';
import { PersonTagEditor } from './PersonTagEditor.jsx';

export interface PersonDetailsProps {
	person: Person;
	className?: string;
}

export function PersonDetails({ person, className }: PersonDetailsProps) {
	const { name, createdAt, createdBy } = hooks.useWatch(person);

	return (
		<Box d="col" items="stretch" gap className={clsx('w-full', className)}>
			<PersonPhoto person={person} />
			<EditableText
				value={name}
				onValueChange={(value) => person.set('name', value)}
				className="text-xl"
			/>
			<Box d="col" items="stretch" className="px-md" gap>
				<Box className="text-xs text-gray-7" items="center" gap="sm">
					<Icon name="clock" /> Added {new Date(createdAt).toLocaleDateString()}{' '}
					(
					<RelativeTime value={createdAt} />)
				</Box>
				{createdBy && <CreatedBy userId={createdBy} />}
				<Location person={person} />
				<PersonTagEditor person={person} />
				<NoteEditor person={person} />
				<Divider />
				<PersonRelationships person={person} />
			</Box>
		</Box>
	);
}

function NoteEditor({
	person,
	className,
}: {
	person: Person;
	className?: string;
}) {
	const { note } = hooks.useWatch(person);

	return (
		<LiveUpdateTextField
			className={clsx('w-full text-sm bg-transparent shadow-none', className)}
			textArea
			value={note || ''}
			onChange={(value) => person.set('note', value)}
			placeholder="Add a note..."
		/>
	);
}

function Location({ person }: { person: Person }) {
	const { geolocation } = hooks.useWatch(person);
	const currentLocation = useGeolocation();

	if (!geolocation) return null;
	if (!currentLocation) return null;
	if (
		distance(geolocation.getAll(), currentLocation) >
		LOCATION_BROAD_SEARCH_RADIUS
	)
		return null;

	return (
		<Box className="text-xs text-gray-7" items="center" gap="sm">
			<Icon name="location" /> Met nearby
		</Box>
	);
}

function CreatedBy({ userId }: { userId: string }) {
	const user = useUserInfo(userId);
	if (!user) return null;
	return (
		<Box className="text-xs text-gray-7" items="center" gap="sm">
			<Icon name="profile" /> Added by{' '}
			<Avatar
				popIn={false}
				name={user.name}
				className="opacity-70"
				imageSrc={user.imageUrl ?? null}
			/>
			<span>{user.name}</span>
		</Box>
	);
}
