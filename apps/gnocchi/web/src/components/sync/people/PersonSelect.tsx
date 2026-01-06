import { Person, hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	Select,
	SelectItemRoot as SelectItem,
	SelectItemIndicator,
	SelectItemRoot,
	SelectItemText,
	SelectProps,
} from '@a-type/ui';
import { useCallback } from 'react';
import { PersonAvatar } from './PersonAvatar.jsx';

export interface PersonSelectProps
	extends Omit<SelectProps, 'value' | 'onChange'> {
	filter?: (person: Person) => boolean;
	includeSelf?: boolean;
	allowNone?: boolean;
	value: string | null;
	onChange: (value: string | null, person: Person | null) => void;
	label?: string;
}

function everyone() {
	return true;
}

export function PersonSelect({
	filter = everyone,
	includeSelf = false,
	value,
	allowNone,
	onChange,
	label,
	...rest
}: PersonSelectProps) {
	const people = hooks.useFindPeers(filter, { includeSelf });
	// oops, don't know which one is self specifically lol
	const self = hooks.useSelf();

	const onChangeInternal = useCallback(
		(value: string | null) => {
			const person = people.find((person) => person.id === value);
			onChange(value === 'null' ? null : value, person || null);
		},
		[people, onChange],
	);

	return (
		<Select
			value={value === null ? 'null' : value}
			onValueChange={onChangeInternal}
			{...rest}
		>
			<Select.Trigger
				className="[&[data-state=open]]:scale-[1.05]"
				contentEditable={false}
				render={<Button emphasis="ghost" size="small" />}
			>
				<Button.Icon
					render={
						<Select.Value contentEditable={false}>
							{value === null ? (
								<PersonAvatar
									popIn={false}
									person={null}
									className="opacity-50"
								/>
							) : (
								<PersonAvatar
									popIn={false}
									person={people.find((person) => person.id === value) || null}
								/>
							)}
						</Select.Value>
					}
				/>
			</Select.Trigger>

			<Select.Content>
				<Select.Group>
					{label && <Select.GroupLabel>{label}</Select.GroupLabel>}
					{allowNone && (
						<SelectItemRoot
							className="flex flex-row gap-2 items-center"
							value="null"
						>
							<PersonAvatar popIn={false} person={null} />
							<SelectItemText>None</SelectItemText>
							<SelectItemIndicator />
						</SelectItemRoot>
					)}
					{people.map((person) => (
						<PersonSelectItem
							key={person.id}
							person={person}
							isSelf={person.id === self.id}
						/>
					))}
				</Select.Group>
			</Select.Content>
		</Select>
	);
}

function PersonSelectItem({
	person,
	isSelf,
}: {
	person: Person;
	isSelf: boolean;
}) {
	if (!person.profile.id) {
		return null;
	}
	return (
		<SelectItem
			value={person.profile.id}
			className="flex flex-row gap-2 items-center"
		>
			<PersonSelectItemLabel person={person} isSelf={isSelf} />
			<SelectItemIndicator />
		</SelectItem>
	);
}

function PersonSelectItemLabel({
	person,
	isSelf,
}: {
	person: Person;
	isSelf: boolean;
}) {
	return (
		<Box items="center" gap="sm">
			<PersonAvatar popIn={false} person={person} />
			{isSelf ? 'Me' : person.profile.name}
		</Box>
	);
}
