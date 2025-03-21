import { hooks } from '@/hooks.js';
import {
	distance,
	LOCATION_BROAD_SEARCH_RADIUS,
	useGeolocation,
} from '@/services/location.js';
import {
	Avatar,
	Box,
	Button,
	clsx,
	Divider,
	EditableText,
	ErrorBoundary,
	Icon,
	LiveUpdateTextField,
	RelativeTime,
	toast,
} from '@a-type/ui';
import { useUserInfo } from '@biscuits/client';

import { EntityDeleteButton } from '@biscuits/client/apps';
import { Person } from '@names.biscuits/verdant';
import { lazy, Suspense } from 'react';
import { PersonPhoto } from './PersonPhoto.jsx';
import { PersonRelationships } from './PersonRelationships.jsx';
import { PersonTagEditor } from './PersonTagEditor.jsx';

const LazyMapView = lazy(() => import('../location/MapView.js'));

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
			<Box d="col" items="stretch" gap>
				<Box className="text-xs color-gray-dark" items="center" gap="sm">
					<Icon name="clock" /> Added {new Date(createdAt).toLocaleDateString()}{' '}
					(
					<RelativeTime value={createdAt} />)
				</Box>
				{createdBy && (
					<Suspense fallback={null}>
						<ErrorBoundary fallback={null}>
							<CreatedBy userId={createdBy} />
						</ErrorBoundary>
					</Suspense>
				)}
				<Location person={person} />
				<Box gap="sm">
					<Icon name="tag" className="color-gray-dark mt-1.5" />
					<Suspense>
						<PersonTagEditor person={person} />
					</Suspense>
				</Box>
				<Box gap="sm">
					<Icon name="note" className="color-gray-dark mt-18px" />
					<NoteEditor person={person} className="flex-1" />
				</Box>
				<Divider />
				<PersonRelationships person={person} />
				<Divider />
				<PersonManage person={person} />
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
			className={clsx('text-sm bg-transparent shadow-none', className)}
			textArea
			value={note || ''}
			onChange={(value) => person.set('note', value)}
			placeholder="Add a note..."
		/>
	);
}

function Location({ person }: { person: Person }) {
	const { geolocation } = hooks.useWatch(person);
	hooks.useWatch(geolocation);
	const currentLocation = useGeolocation();

	const client = hooks.useClient();
	const remove = () => {
		person.set('geolocation', null);
		const id = toast(
			<Box gap="sm" items="center">
				<span>Location removed</span>
				<Button
					size="small"
					onClick={() => {
						client.undoHistory.undo();
						toast.remove(id);
					}}
				>
					Undo
				</Button>
			</Box>,
			{
				duration: 10 * 1000,
			},
		);
	};

	if (!geolocation) return null;
	const nearby =
		currentLocation &&
		distance(geolocation.getAll(), currentLocation) >
			LOCATION_BROAD_SEARCH_RADIUS;

	if (!geolocation) return null;

	return (
		<Box d="col" gap="sm">
			<Box className="text-xs color-gray-dark" items="start" gap="sm">
				<Icon name="locate" />
				<Box d="col" gap="sm" className="flex-1">
					<LazyMapView
						location={geolocation.getAll()}
						className="w-full h-[200px] rounded-md"
					/>
					{geolocation.get('label') && <span>{geolocation.get('label')}</span>}
				</Box>
				<Button onClick={remove} color="ghostDestructive" size="icon">
					<Icon name="x" />
				</Button>
			</Box>
			{nearby && (
				<Box className="text-xs color-gray-dark" items="center" gap="sm">
					<Icon name="location" /> Met nearby
				</Box>
			)}
		</Box>
	);
}

function CreatedBy({ userId }: { userId: string }) {
	const user = useUserInfo(userId);
	if (!user) return null;
	return (
		<Box className="text-xs color-gray-dark" items="center" gap="sm">
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

function PersonManage({ person }: { person: Person }) {
	return (
		<Box gap>
			<EntityDeleteButton
				redirectTo="/"
				entity={person}
				color="ghostDestructive"
				entityName={person.get('name')}
			/>
		</Box>
	);
}
