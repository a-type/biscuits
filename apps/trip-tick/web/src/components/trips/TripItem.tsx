import {
	getComputedQuantity,
	quantityForecast,
} from '@/components/trips/utils.js';
import { ResultOf } from '@/graphql.js';
import { hooks } from '@/store.js';
import {
	Button,
	CheckboxRoot,
	Icon,
	LiveUpdateTextField,
	NumberStepper,
	SliderRange,
	SliderRoot,
	SliderThumb,
	SliderTrack,
	useParticles,
} from '@a-type/ui';
import {
	ListItemsItem,
	TripCompletionsValue,
	TripExtraItemsValueItem,
} from '@trip-tick.biscuits/verdant';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { getItemRulesLabel } from '../lists/utils.js';

export function ListItem({
	item,
	days,
	completion,
	onCompletionChanged,
	forecast,
}: {
	item: ListItemsItem;
	days: number;
	completion: TripCompletionsValue;
	onCompletionChanged: (completion: TripCompletionsValue) => void;
	forecast?: ResultOf<typeof quantityForecast>;
}) {
	const {
		description,
		periodMultiplier,
		conditions,
		quantity,
		additional,
		roundDown,
		period,
	} = hooks.useWatch(item);
	hooks.useWatch(conditions, { deep: true });
	const computedQuantity = getComputedQuantity({
		periodMultiplier,
		quantity,
		days,
		additional,
		roundDown,
		conditions: conditions.getSnapshot(),
		weather: forecast,
		period,
	});

	if (computedQuantity === 0) {
		return null;
	}

	return (
		<ChecklistItem
			description={description}
			completedQuantity={completion}
			computedQuantity={computedQuantity}
			onCompletionChanged={onCompletionChanged}
			subline={getItemRulesLabel(item)}
		/>
	);
}

export function ExtraItem({
	item,
	completion,
	onCompletionChanged,
	onDelete,
}: {
	item: TripExtraItemsValueItem;
	completion: TripCompletionsValue;
	onCompletionChanged: (completion: TripCompletionsValue) => void;
	onDelete: () => void;
}) {
	const { description, quantity } = hooks.useWatch(item);

	return (
		<ChecklistItem
			description={description}
			completedQuantity={completion}
			computedQuantity={quantity}
			onCompletionChanged={onCompletionChanged}
			onDescriptionChanged={(value) => item.set('description', value)}
			onQuantityChanged={(value) => item.set('quantity', value)}
			onDelete={onDelete}
			subline="Added for this trip"
		/>
	);
}

function ChecklistItem({
	computedQuantity,
	completedQuantity,
	onCompletionChanged,
	description,
	onDescriptionChanged,
	onQuantityChanged,
	subline,
	onDelete,
}: {
	computedQuantity: number;
	completedQuantity: number;
	onCompletionChanged: (value: number) => void;
	description: string;
	onDescriptionChanged?: (value: string) => void;
	onQuantityChanged?: (value: number) => void;
	onDelete?: () => void;
	subline?: string;
}) {
	const completed = completedQuantity >= computedQuantity;

	const mainOnChecked = (checked: boolean) => {
		if (checked) {
			onCompletionChanged(completedQuantity + 1);
		} else {
			onCompletionChanged(0);
		}
	};

	const canEdit = onDescriptionChanged || onQuantityChanged;
	const [editing, setEditing] = useState(canEdit && !description);

	const particles = useParticles();
	const barRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (completed && barRef.current) {
			particles?.elementExplosion({
				count: 40,
				element: barRef.current,
				color: {
					opacity: 1,
					space: 'rgb',
					values: [115, 219, 160],
				},
			});
		}
	}, [completed, particles]);

	return (
		<div className="w-full p-2 flex flex-col gap-2">
			<div className="row w-full">
				<CheckboxRoot
					checked={completed}
					onCheckedChange={mainOnChecked}
					className="w-32px h-32px rounded-full touch-none flex items-center justify-center text-black"
				>
					<Icon name="check" />
				</CheckboxRoot>
				<div className="col items-start flex-1">
					<div className="w-full flex flex-row items-center gap-2 flex-wrap">
						{onDescriptionChanged && editing ?
							<LiveUpdateTextField
								value={description}
								onChange={onDescriptionChanged}
								placeholder="What is it?"
								className="flex-1 min-w-50%"
								autoSelect
								autoFocus
							/>
						:	<label className="font-bold select-none">{description}</label>}
						{!!onQuantityChanged && editing && (
							<NumberStepper
								value={computedQuantity}
								onChange={onQuantityChanged}
								className="mr-auto"
							/>
						)}
						{editing && onDelete && (
							<Button size="icon" color="ghostDestructive" onClick={onDelete}>
								<Icon name="x" />
							</Button>
						)}
						{canEdit && (
							<Button
								size="icon"
								color={editing ? 'default' : 'ghost'}
								onClick={() => setEditing((v) => !v)}
							>
								<Icon name={editing ? 'check' : 'pencil'} />
							</Button>
						)}
					</div>
					<SliderRoot
						className="flex-1 pointer-events-none"
						value={[completedQuantity]}
						min={0}
						max={computedQuantity}
						onValueChange={([v]) => onCompletionChanged(v)}
						style={{
							// Fix overflow clipping in Safari
							// https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
							transform: 'translateZ(0)',
						}}
						ref={barRef}
					>
						<SliderTrack className="pointer-events-none">
							<SliderRange
								className="transition-all pointer-events-none"
								data-color={completed ? 'default' : 'primary'}
							/>
							{new Array(computedQuantity - 1).fill(0).map((_, i) => (
								<div
									key={i}
									className="w-1px h-full bg-gray-6 absolute top-0 left-0"
									style={{
										left: `${(100 / computedQuantity) * (i + 1)}%`,
									}}
								/>
							))}
						</SliderTrack>
						<SliderThumb
							data-color={completed ? 'default' : 'primary'}
							className={classNames(
								'transition-all ring-1 w-8px rounded-sm pointer-events-initial',
								completed && 'bg-accent ring-black ring-1 text-white',
								'flex items-center justify-center',
								// completedQuantity === 0 && 'opacity-0',
							)}
						/>
					</SliderRoot>
				</div>
			</div>
			<div className="flex flex-row justify-between gap-2 items-center text-xs text-gray-7">
				{subline && <div className="italic">{subline}</div>}
				<span className="ml-auto">
					{completedQuantity} / {computedQuantity}
				</span>
			</div>
		</div>
	);
}
