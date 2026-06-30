import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Dialog,
	DialogContent,
	FormikForm,
	Icon,
	Select,
	SelectItem,
	SubmitButton,
	Text,
	TextField,
	withClassName,
} from '@a-type/ui';
import { List } from '@gnocchi.biscuits/verdant';
import { useState } from 'react';

function getRandomColor(): string {
	const colors: string[] = ['lemon', 'blueberry', 'tomato', 'eggplant', 'leek'];
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
						<SubmitButton>Create</SubmitButton>
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
				<FilledIcon name="tag" className="@mode-lemon" />
				<Text truncate>Default</Text>
			</Box>
		);
	}

	if (list === undefined) {
		return (
			<Box items="center" gap="sm">
				<MultiListIcon />
				<Text truncate>All lists</Text>
			</Box>
		);
	}

	return (
		<Box items="center" gap="sm">
			<FilledIcon
				name="tag"
				className={`@mode-${list.get('color') ?? 'lemon'}`}
			/>
			<Text truncate>{list.get('name')}</Text>
		</Box>
	);
}

function MultiListIcon() {
	return (
		<div style={{ position: 'relative', display: 'inline' }}>
			<Icon
				name="tag"
				style={{
					position: 'relative',
					left: -3,
				}}
			/>
			<Icon
				name="tag"
				style={{
					position: 'absolute',
					left: 1,
					top: 0,
					fill: 'var(--m-color-neutral-paper)',
				}}
			/>
		</div>
	);
}
