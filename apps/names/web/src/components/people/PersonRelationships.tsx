import { hooks, useAddRelationship } from '@/hooks.js';
import { relationshipOpposites } from '@/relationships.js';
import { Avatar, Box, Button, Chip, clsx, H2, Icon, Select } from '@a-type/ui';
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
		<Box d="col" gap="md">
			<H2 className="text-md">
				<Icon name="connection" className="color-gray-dark mr-1" />{' '}
				Relationships
			</H2>
			<RelationshipSearch person={person} />

			{relationships.map((relationship) => (
				<Suspense>
					<PersonRelationshipItem
						key={relationship.uid}
						relationship={relationship}
						sourcePerson={person}
					/>
				</Suspense>
			))}
			<Suspense>
				<RelationshipSuggestions person={person} omit={relationships} />
			</Suspense>
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
				"grid [grid-template-areas:'avatar_name_arrow'_'remove_type_arrow'] [grid-template-columns:auto_1fr_auto] sm:([grid-template-areas:'remove_avatar_name_type_arrow'] [grid-template-columns:auto_auto_1fr_auto_auto]) gap-sm items-center",
				'border border-solid border-gray rounded-md p-sm select-none',
			)}
		>
			<Button
				size="icon"
				color="ghostDestructive"
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
			<Button asChild size="icon" color="ghost" className="grid-area-[arrow]">
				<Link to={`/people/${otherPersonId}`}>
					<Icon name="arrowRight" />
				</Link>
			</Button>
		</div>
	);
}

function RelationshipSuggestions({
	person,
	omit,
}: {
	person: Person;
	omit: Relationship[];
}) {
	const { name, dismissedSuggestions } = hooks.useWatch(person);
	hooks.useWatch(dismissedSuggestions);
	const surname = name.split(' ').pop();

	const matches = hooks
		.useAllPeople({
			index: {
				where: 'matchName',
				equals: surname?.toLowerCase() ?? '',
			},
			key: 'suggestionNameMatch',
		})
		.filter((match) => match.get('id') !== person.get('id'))
		.filter((match) => !dismissedSuggestions.has(match.get('id')))
		.filter(
			(match) =>
				!omit.some(
					(r) =>
						r.get('personAId') === match.get('id') ||
						r.get('personBId') === match.get('id'),
				),
		);

	const addRelationship = useAddRelationship();

	if (!matches.length) return null;

	return (
		<Box d="col" items="stretch" gap="sm">
			<Box className="color-gray-dark" gap="sm" items="center">
				<Icon name="magic" />
				Suggested
			</Box>
			<Box wrap gap="sm" items="center">
				{matches.map((match) => (
					<Chip className="select-none !p-0 overflow-hidden">
						<button
							onClick={() => addRelationship(person.get('id'), match.get('id'))}
							className="border-0 text-inherit font-inherit p-0 bg-transparent text-sm pl-3 pr-1 focus-visible:bg-primary-wash hover:bg-white focus:outline-none cursor-pointer self-stretch"
						>
							{match.get('name')}
						</button>
						<Button
							size="icon-small"
							color="ghostDestructive"
							onClick={() => dismissedSuggestions.add(match.get('id'))}
						>
							<Icon name="x" />
						</Button>
					</Chip>
				))}
			</Box>
		</Box>
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
				</Select.Group>
			</Select.Content>
		</Select>
	);
}

function RelationshipSearch({ person }: { person: Person }) {
	const addRelationship = useAddRelationship();
	return (
		<Box d="row" gap="sm" items="center">
			<Icon name="add_person" className="color-gray-dark" />
			<Suspense>
				<PersonNameSearchField
					onSelect={(otherId) => addRelationship(person.get('id'), otherId)}
					placeholder="Add relationships..."
					className="flex-1"
				/>
			</Suspense>
		</Box>
	);
}
