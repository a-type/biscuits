import { hooks, useAddRelationship } from '@/hooks.js';
import { relationshipOpposites } from '@/relationships.js';
import {
	Avatar,
	Box,
	Button,
	Chip,
	clsx,
	H2,
	Icon,
	Masonry,
	Select,
} from '@a-type/ui';
import { Person, Relationship } from '@names.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { Suspense } from 'react';
import { PersonNameSearchField } from './PersonNameSearchField.jsx';

export interface PersonRelationshipsProps {
	person: Person;
}

export function PersonRelationships({ person }: PersonRelationshipsProps) {
	const relationships = hooks.useAllRelationships({
		index: {
			where: 'personId',
			equals: person.get('id'),
		},
	});

	return (
		<Box d="col" gap="lg">
			<H2 className="text-md">
				<Icon name="connection" className="color-gray-dark mr-md" />{' '}
				Relationships
			</H2>
			<RelationshipSearch person={person} />

			<Masonry
				columns={(width) => {
					if (width < 640) return 1;
					if (width < 900) return 2;
					return 3;
				}}
			>
				{relationships.map((relationship) => (
					<Suspense>
						<PersonRelationshipItem
							key={relationship.uid}
							relationship={relationship}
							sourcePerson={person}
						/>
					</Suspense>
				))}
			</Masonry>
		</Box>
	);
}

function PersonRelationshipItem({
	relationship,
	sourcePerson,
}: {
	relationship: Relationship;
	sourcePerson: Person;
}) {
	const { personAId, personBId, personALabel, personBLabel } =
		hooks.useWatch(relationship);
	const otherPersonId =
		personAId === sourcePerson.get('id') ? personBId : personAId;
	const otherPersonLabel =
		otherPersonId === personAId ? personALabel : personBLabel;
	const person = hooks.usePerson(otherPersonId);
	hooks.useWatch(person);
	const photo = person?.get('photo');
	hooks.useWatch(photo || null);

	const setOtherPersonLabel = (label: string) => {
		const updates = {} as { personALabel?: string; personBLabel?: string };
		if (otherPersonId === personAId) {
			updates.personALabel = label;
			updates.personBLabel = relationshipOpposites[label] ?? label;
		} else {
			updates.personBLabel = label;
			updates.personALabel = relationshipOpposites[label] ?? label;
		}
		relationship.update(updates);
	};

	const client = hooks.useClient();
	const remove = () => {
		client.relationships.delete(relationship.get('id'));
	};

	if (!person) return null;

	return (
		<div
			className={clsx(
				"grid [grid-template-areas:'avatar_name_arrow'_'remove_type_arrow'] [grid-template-columns:auto_1fr_auto] gap-sm items-center",
				'border border-solid border-gray rounded-md p-sm select-none',
				'sm:p-md',
			)}
		>
			<Button
				color="attention"
				emphasis="ghost"
				onClick={remove}
				className="grid-area-[remove]"
			>
				<Icon name="x" />
			</Button>
			<Avatar
				imageSrc={photo?.url ?? null}
				name={person.get('name')}
				popIn={false}
				className="grid-area-[avatar] ml-6px sm:ml-0"
			/>
			<span className="grid-area-[name]">{person.get('name')}</span>
			<RelationshipTypeSelect
				value={otherPersonLabel}
				onChange={setOtherPersonLabel}
				className="grid-area-[type]"
			/>
			<Button asChild emphasis="ghost" className="grid-area-[arrow]">
				<Link to={`/people/${otherPersonId}`}>
					<Icon name="arrowRight" />
				</Link>
			</Button>
		</div>
	);
}

function RelationshipTypeSelect({
	value,
	onChange,
	className,
}: {
	value: string | null;
	onChange: (value: string) => void;
	className?: string;
}) {
	return (
		<Select value={value || 'unknown'} onValueChange={onChange}>
			<Select.Trigger asChild>
				<Chip
					className={clsx(
						'text-sm px-4 self-center justify-self-start',
						className,
					)}
				>
					<Select.Value />
				</Chip>
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="unknown">Select type...</Select.Item>
				<Select.Group>
					<Select.Label>Close Family</Select.Label>
					<Select.Item value="family">Family</Select.Item>
					<Select.Item value="spouse">Spouse</Select.Item>
					<Select.Item value="partner">Partner</Select.Item>
					<Select.Item value="child">Child</Select.Item>
					<Select.Item value="parent">Parent</Select.Item>
					<Select.Item value="guardian">Guardian</Select.Item>
					<Select.Item value="sibling">Sibling</Select.Item>
					<Select.Item value="grandparent">Grandparent</Select.Item>
					<Select.Item value="grandchild">Grandchild</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>Friends</Select.Label>
					<Select.Item value="friend">Friend</Select.Item>
					<Select.Item value="neighbor">Neighbor</Select.Item>
					<Select.Item value="classmate">Classmate</Select.Item>
					<Select.Item value="roommate">Roommate</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>Extended Family</Select.Label>
					<Select.Item value="aunt">Aunt</Select.Item>
					<Select.Item value="uncle">Uncle</Select.Item>
					<Select.Item value="cousin">Cousin</Select.Item>
					<Select.Item value="niece">Niece</Select.Item>
					<Select.Item value="nephew">Nephew</Select.Item>
					<Select.Item value="inlaw">In-law</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>Professional & Acquaintances</Select.Label>
					<Select.Item value="colleague">Colleague</Select.Item>
					<Select.Item value="landlord">Acquaintance</Select.Item>
					<Select.Item value="boss">Boss</Select.Item>
					<Select.Item value="teammate">Teammate</Select.Item>
					<Select.Item value="coach">Coach</Select.Item>
					<Select.Item value="teacher">Teacher</Select.Item>
					<Select.Item value="student">Student</Select.Item>
					<Select.Item value="nanny">Nanny</Select.Item>
					<Select.Item value="babysitter">Babysitter</Select.Item>
					<Select.Item value="doctor">Doctor</Select.Item>
					<Select.Item value="nurse">Nurse</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select>
	);
}

function RelationshipSearch({ person }: { person: Person }) {
	const addRelationship = useAddRelationship();
	return (
		<Box d="row" gap="md" items="center">
			<Icon name="add_person" className="color-gray-dark" />
			<Suspense>
				<PersonNameSearchField
					onSelect={(otherId) => addRelationship(person.get('id'), otherId)}
					placeholder="Add relationships..."
					className="flex-1"
					allowAdd
				/>
			</Suspense>
		</Box>
	);
}
