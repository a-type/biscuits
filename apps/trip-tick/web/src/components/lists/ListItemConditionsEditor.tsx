import { hooks } from '@/store.js';
import {
	Button,
	clsx,
	DropdownMenu,
	DropdownMenuArrow,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
	Icon,
	Input,
} from '@a-type/ui';
import {
	ListItemsItem,
	ListItemsItemConditions,
	ListItemsItemConditionsItem,
	ListItemsItemConditionsItemInit,
	ListItemsItemConditionsItemType,
} from '@trip-tick.biscuits/verdant';
import { useTemperatureUnit } from '../weather/useTemperatureUnit.js';

export interface ListItemConditionsEditorProps {
	item: ListItemsItem;
}

const conditionTypeInits: Record<
	ListItemsItemConditionsItemType,
	ListItemsItemConditionsItemInit
> = {
	rain: { type: 'rain' },
	hot: { type: 'hot', params: { temperature: 299 } },
	cold: { type: 'cold', params: { temperature: 277 } },
};

export function ListItemConditionsEditor({
	item,
}: ListItemConditionsEditorProps) {
	const { conditions, period } = hooks.useWatch(item);
	hooks.useWatch(conditions);

	return (
		<div className="col items-stretch">
			{conditions.map((cond, i) => (
				<div key={i} className="row w-full">
					<ListItemConditionEditor condition={cond} />
					<Button
						size="icon"
						color="ghostDestructive"
						onClick={() => conditions.removeAll(cond)}
					>
						<Icon name="x" />
					</Button>
				</div>
			))}
			<AddCondition conditions={conditions} />
		</div>
	);
}

function AddCondition({ conditions }: { conditions: ListItemsItemConditions }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button color="default" size="small" className="self-start">
					<Icon name="plus" />
					<span>Add condition...</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="!z-10000">
				<DropdownMenuArrow />
				{Object.keys(conditionTypeInits).map((type) => (
					<DropdownMenuItem
						key={type}
						onClick={() => {
							conditions.push(
								conditionTypeInits[type as ListItemsItemConditionsItemType],
							);
						}}
					>
						<ConditionTypeLabel
							type={type as ListItemsItemConditionsItemType}
						/>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ConditionTypeLabel({
	type,
}: {
	type: ListItemsItemConditionsItemType;
}) {
	switch (type) {
		case 'rain':
			return (
				<>
					Only when raining
					<DropdownMenuItemRightSlot>
						<Icon name="waterDrop" className="fill-primary-light" />
					</DropdownMenuItemRightSlot>
				</>
			);
		case 'hot':
			return (
				<>
					When it's hotter than...
					<DropdownMenuItemRightSlot>
						<Icon
							name="thermometer"
							className="text-primary-dark theme-tomato"
						/>
					</DropdownMenuItemRightSlot>
				</>
			);
		case 'cold':
			return (
				<>
					When it's colder than...
					<DropdownMenuItemRightSlot>
						<Icon
							name="thermometer"
							className="text-primary-dark theme-blueberry"
						/>
					</DropdownMenuItemRightSlot>
				</>
			);
	}
}

function ListItemConditionEditor({
	condition,
}: {
	condition: ListItemsItemConditionsItem;
}) {
	const { type } = hooks.useWatch(condition);

	switch (type) {
		case 'rain':
			return <RainConditionEditor condition={condition} />;
		case 'hot':
		case 'cold':
			return <TemperatureConditionEditor condition={condition} />;
	}
}

function RainConditionEditor({
	condition: _,
}: {
	condition: ListItemsItemConditionsItem;
}) {
	return (
		<div className="row">
			<Icon name="waterDrop" className="fill-primary-light" />
			<span>Only when raining</span>
		</div>
	);
}

function TemperatureConditionEditor({
	condition,
}: {
	condition: ListItemsItemConditionsItem;
}) {
	const { params, type } = hooks.useWatch(condition);
	const temperatureField = hooks.useField(params, 'temperature');
	const { toDisplay, fromDisplay, unit } = useTemperatureUnit();

	return (
		<div className="row">
			<Icon
				name="thermometer"
				className={clsx(
					'text-primary-dark',
					`theme-${type === 'hot' ? 'tomato' : 'blueberry'}`,
				)}
			/>
			<span>When it's {type === 'hot' ? 'hotter' : 'colder'} than</span>
			<Input
				className="w-80px"
				type="number"
				value={toDisplay(temperatureField.value)}
				onChange={(ev) => {
					if (isNaN(ev.currentTarget.valueAsNumber)) return;
					temperatureField.setValue(
						fromDisplay(ev.currentTarget.valueAsNumber),
					);
				}}
				maxLength={3}
				autoSelect
			/>
			<span>&deg; {unit[0].toUpperCase()}</span>
		</div>
	);
}
