import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Dialog,
	DialogContent,
	FormikForm,
	Icon,
	PaletteName,
	Select,
	SelectItem,
	SubmitButton,
	TextField,
	withClassName,
} from '@a-type/ui';
import { List } from '@gnocchi.biscuits/verdant';
import { useState } from 'react';

function getRandomColor(): PaletteName {
	const colors: PaletteName[] = [
		'lemon',
		'blueberry',
		'tomato',
		'eggplant',
		'leek',
	];
	return colors[Math.floor(Math.random() * colors.length)] as any;
}

export interface ListSelectProps {
	includeAll?: boolean;
	value: string | null | undefined;
	onChange: (value: string | null | undefined) => void;
	className?: string;
}

const FilledIcon = withClassName(Icon, 'important:fill-main');

export function ListSelect({
	value,
	onChange,
	includeAll,
	className,
}: ListSelectProps) {
	const lists = hooks.useAllLists();
	const [isCreating, setIsCreating] = useState(false);
	const client = hooks.useClient();

	const resolvedValue = includeAll ? value : value === undefined ? null : value;

	return (
		<>
			<Select
				value={resolvedValue ?? `${resolvedValue}`}
				onValueChange={(val) => {
					if (val === 'null') onChange(null);
					if (val === 'undefined') onChange(undefined);
					else if (val === 'new') {
						setIsCreating(true);
					} else onChange(val);
				}}
			>
				<Select.Trigger className={className} size="small">
					<Select.Value>
						<ListSelectItemLabel
							list={
								resolvedValue === undefined || resolvedValue === null
									? resolvedValue
									: lists.find((l) => l.get('id') === resolvedValue) ?? null
							}
						/>
					</Select.Value>
					<Select.Icon />
				</Select.Trigger>
				<Select.Content>
					{includeAll && (
						<Select.Item value="undefined">
							<ListSelectItemLabel list={undefined} />
						</Select.Item>
					)}
					<Select.Item value={'null'}>
						<ListSelectItemLabel list={null} />
					</Select.Item>
					{lists.map((list) => (
						<ListSelectItem key={list.get('id')} list={list} />
					))}
					<Select.Separator />
					<Select.Item value={'new'}>New List</Select.Item>
				</Select.Content>
			</Select>
			<Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
				<DialogContent>
					<FormikForm
						initialValues={{ name: '' }}
						onSubmit={async ({ name }) => {
							const list = await client.lists.put({
								name,
								color: getRandomColor(),
							});
							onChange(list.get('id'));
							setIsCreating(false);
						}}
					>
						<TextField
							name="name"
							label="Name"
							placeholder="Custom list"
							required
						/>
						<SubmitButton className="self-end">Create</SubmitButton>
					</FormikForm>
				</DialogContent>
			</Dialog>
		</>
	);
}

function ListSelectItem({ list }: { list: List }) {
	hooks.useWatch(list);
	return (
		<SelectItem value={list.get('id')}>
			<ListSelectItemLabel list={list} />
		</SelectItem>
	);
}

function ListSelectItemLabel({ list }: { list: List | null | undefined }) {
	if (list === null) {
		return (
			<Box items="center" gap="sm">
				<FilledIcon name="tag" className="palette-lemon" />
				<span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
					Default
				</span>
			</Box>
		);
	}

	if (list === undefined) {
		return (
			<Box items="center" gap="sm">
				<MultiListIcon />
				<span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
					All lists
				</span>
			</Box>
		);
	}

	return (
		<Box items="center" gap="sm">
			<FilledIcon
				name="tag"
				className={`palette-${list.get('color') ?? 'lemon'}`}
			/>
			<span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
				{list.get('name')}
			</span>
		</Box>
	);
}

function MultiListIcon() {
	return (
		<div className="relative inline">
			<Icon name="tag" className="relative -left-3px" />
			<Icon name="tag" className="absolute top-0 left-1px fill-white" />
		</div>
	);
}
