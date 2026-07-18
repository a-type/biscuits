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
	Heading,
	Icon,
	LiveUpdateTextField,
	RelativeTime,
	Text,
	toast,
} from '@a-type/ui';
import { useUserInfo } from '@biscuits/client';

import { EntityDeleteButton } from '@biscuits/client/apps';
import { Person } from '@names.biscuits/verdant';
import { lazy, Suspense } from 'react';
import { PersonPhoto } from './PersonPhoto.jsx';
import { PersonQuickActions } from './PersonQuickActions.jsx';
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
		<Box col items="stretch" gap className={clsx('w-full', className)}>
			<PersonPhoto person={person} />
			<Heading emphasis="primary">
				<EditableText
					value={name}
					onValueChange={(value) => person.set('name', value)}
					style={{ marginRight: 'auto' }}
				/>
			</Heading>
			<PersonQuickActions person={person} />
			<Box col items="stretch" className="@mode-dense" gap="lg">
				<Box gap="md" dim>
					<Icon name="clock" style={{ marginTop: 2 }} />
					<Text dim>
						Added {new Date(createdAt).toLocaleDateString()} (
						<RelativeTime value={createdAt} />)
					</Text>
				</Box>
				{createdBy && (
					<Suspense fallback={null}>
						<ErrorBoundary fallback={null}>
							<CreatedBy userId={createdBy} />
						</ErrorBoundary>
					</Suspense>
				)}
				<Suspense fallback={null}>
					<Location person={person} />
				</Suspense>
				<Box gap="md" dim>
					<Icon name="tag" style={{ marginTop: 6 }} />
					<Suspense>
						<PersonTagEditor person={person} />
					</Suspense>
				</Box>
				<Box gap="md" dim>
					<Icon name="note" style={{ marginTop: 6 }} />
					<NoteEditor person={person} style={{ flex: 1 }} />
				</Box>
				<Divider padded />
				<PersonRelationships person={person} />
				<Divider padded />
				<PersonManage person={person} />
			</Box>
		</Box>
	);
}

function NoteEditor({
	person,
	className,
	...rest
}: {
	person: Person;
	className?: string;
	style?: React.CSSProperties;
}) {
	const { note } = hooks.useWatch(person);

	return (
		<LiveUpdateTextField
			className={clsx('w-full @mode-dense', className)}
			textArea
			value={note || ''}
			onChange={(value) => person.set('note', value)}
			placeholder="Add a note..."
			{...rest}
		/>
	);
}

function Location({ person }: { person: Person }) {
	const { geolocation } = hooks.useWatch(person);
	hooks.useWatch(geolocation);
	const currentLocation = useGeolocation();

	const remove = () => {
		const prev = person.get('geolocation')?.getSnapshot();
		person.set('geolocation', null);
		const id = toast.success('Location removed', {
			timeout: 10_000,
			data: {
				actions: [
					{
						label: 'Undo',
						onClick: () => {
							person.set('geolocation', prev);
							toast.update(id, 'Location restored', {
								type: 'success',
							});
						},
					},
				],
			},
		});
	};

	if (!geolocation) return null;
	const nearby =
		currentLocation &&
		distance(geolocation.getAll(), currentLocation) >
			LOCATION_BROAD_SEARCH_RADIUS;

	if (!geolocation) return null;

	return (
		<Box col gap="sm">
			<Box dim className="@mode-dense" items="start" gap="md">
				<Icon name="locate" />
				<Box col gap="sm" grow>
					<LazyMapView
						location={geolocation.getAll()}
						style={{
							pointerEvents: 'none',
							height: 200,
							width: '100%',
							borderRadius: 'var(--m-rd)',
						}}
					/>
					{geolocation.get('label') && <span>{geolocation.get('label')}</span>}
				</Box>
				<Button onClick={remove} color="attention" emphasis="ghost">
					<Icon name="x" />
				</Button>
			</Box>
			{nearby && (
				<Box dim className="@mode-dense" items="center" gap="md">
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
		<Box dim className="@mode-dense" items="center" gap="sm">
			<Icon name="profile" /> Added by{' '}
			<Avatar
				name={user.name}
				style={{ opacity: 0.7 }}
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
				color="attention"
				emphasis="ghost"
				entityName={person.get('name')}
			/>
		</Box>
	);
}
