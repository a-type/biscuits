import {
	getComputedQuantity,
	quantityForecast,
} from '@/components/trips/utils.js';
import { hooks } from '@/store.js';
import {
	Button,
	CheckboxRoot,
	clsx,
	Icon,
	LiveUpdateTextField,
	NumberStepper,
	Slider,
	useParticles,
} from '@a-type/ui';
import { ResultOf } from '@biscuits/graphql';
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
		<div className="w-full flex flex-col gap-2 p-2">
			<div className="w-full row">
				<CheckboxRoot
					checked={completed}
					onCheckedChange={mainOnChecked}
					className="palette-accent h-32px w-32px flex touch-none items-center justify-center rounded-full color-black"
				>
					<Icon name="check" />
				</CheckboxRoot>
				<div className="flex flex-1 flex-col items-start">
					<div className="w-full flex flex-row flex-wrap items-center gap-2">
						{onDescriptionChanged && editing ?
							<LiveUpdateTextField
								value={description}
								onChange={onDescriptionChanged}
								placeholder="What is it?"
								className="min-w-50% flex-1"
								autoSelect
								autoFocus
							/>
						:	<label className="select-none font-bold">{description}</label>}
						{!!onQuantityChanged && editing && (
							<NumberStepper
								value={computedQuantity}
								onChange={onQuantityChanged}
								className="mr-auto"
							/>
						)}
						{editing && onDelete && (
							<Button color="attention" emphasis="ghost" onClick={onDelete}>
								<Icon name="x" />
							</Button>
						)}
						{canEdit && (
							<Button
								emphasis={editing ? 'default' : 'ghost'}
								onClick={() => setEditing((v) => !v)}
							>
								<Icon name={editing ? 'check' : 'pencil'} />
							</Button>
						)}
					</div>
					<Slider.Base
						className={clsx(
							'pointer-events-none w-full flex-1',
							completed ? 'palette-accent' : 'palette-primary',
						)}
						value={completedQuantity}
						min={0}
						max={computedQuantity}
						onValueChange={(v) => onCompletionChanged(v as number)}
						style={{
							// Fix overflow clipping in Safari
							// https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
							transform: 'translateZ(0)',
						}}
						ref={barRef}
					>
						<Slider.Track className="pointer-events-none">
							<Slider.Indicator className="pointer-events-none transition-all" />
							{new Array(computedQuantity - 1).fill(0).map((_, i) => (
								<div
									key={i}
									className="pointer-events-none absolute left-0 top-0 h-full w-1px bg-gray-dark"
									style={{
										left: `${(100 / computedQuantity) * (i + 1)}%`,
									}}
								/>
							))}
							<Slider.Thumb
								className={classNames(
									'pointer-events-initial w-8px rounded-sm ring-1 transition-all',
									completed && 'ring-1 color-white bg-main ring-black',
									'flex items-center justify-center',
									// completedQuantity === 0 && 'opacity-0',
								)}
							/>
						</Slider.Track>
					</Slider.Base>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between gap-2 text-xs color-gray-dark">
				{subline && <div className="italic">{subline}</div>}
				<span className="ml-auto">
					{completedQuantity} / {computedQuantity}
				</span>
			</div>
		</div>
	);
}
