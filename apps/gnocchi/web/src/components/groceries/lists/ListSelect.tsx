import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Dialog,
	DialogContent,
	FormikForm,
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SubmitButton,
	TextField,
	ThemeName,
	withClassName,
} from '@a-type/ui';
import { List } from '@gnocchi.biscuits/verdant';
import { useState } from 'react';

function getRandomColor(): ThemeName {
	const colors: ThemeName[] = [
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
	inDialog?: boolean;
	className?: string;
}

const FilledIcon = withClassName(Icon, 'important:fill-primary');

export function ListSelect({
	value,
	onChange,
	includeAll,
	inDialog,
	className,
}: ListSelectProps) {
	const lists = hooks.useAllLists();
	const [isCreating, setIsCreating] = useState(false);
	const client = hooks.useClient();

	return (
		<>
			<Select
				value={value ?? `${value}`}
				onValueChange={(val) => {
					if (val === 'null') onChange(null);
					if (val === 'undefined') onChange(undefined);
					else if (val === 'new') {
						setIsCreating(true);
					} else onChange(val);
				}}
			>
				<SelectTrigger className={className} size="small" />
				<SelectContent inDialog={inDialog}>
					{includeAll && <SelectItem value="undefined">All lists</SelectItem>}
					<SelectItem value={'null'}>
						<div className="flex flex-row gap-2 items-center">
							<FilledIcon name="tag" className="theme-lemon" />
							<span>Default</span>
						</div>
					</SelectItem>
					{lists.map((list) => (
						<ListSelectItem key={list.get('id')} list={list} />
					))}
					<SelectSeparator />
					<SelectItem value={'new'}>New List</SelectItem>
				</SelectContent>
			</Select>
			<Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
				<DialogContent>
					<FormikForm
						initialValues={{ name: '' }}
						onSubmit={async ({ name }, bag) => {
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
	const { color, id, name } = hooks.useWatch(list);
	return (
		<SelectItem value={id}>
			<div className="flex flex-row gap-2 items-center">
				<FilledIcon name="tag" className={`theme-${color ?? 'lemon'}`} />
				<span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
					{name}
				</span>
			</div>
		</SelectItem>
	);
}
