import {
	getComputedQuantity,
	quantityForecast,
} from '@/components/trips/utils.js';
import { hooks } from '@/store.js';
import {
	Box,
	Button,
	CheckboxRoot,
	clsx,
	Icon,
	LiveUpdateTextField,
	NumberStepper,
	Slider,
	Text,
	useParticles,
} from '@a-type/ui';
import { ResultOf } from '@biscuits/graphql';
import {
	ListItemsItem,
	TripCompletionsValue,
	TripExtraItemsValueItem,
} from '@trip-tick.biscuits/verdant';
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
		<Box col gap="sm" p="sm" full="width">
			<Box full="width" gap items="center">
				<CheckboxRoot
					checked={completed}
					onCheckedChange={mainOnChecked}
					style={{
						touchAction: 'none',
						display: 'flex',
					}}
					className="@mode-accent"
				>
					<Icon name="check" style={{ margin: 'auto' }} />
				</CheckboxRoot>
				<Box grow col items="start">
					<Box full="width" wrap items="center" gap="sm">
						{onDescriptionChanged && editing ?
							<LiveUpdateTextField
								value={description}
								onChange={onDescriptionChanged}
								placeholder="What is it?"
								style={{
									minWidth: '50%',
									flexGrow: 1,
								}}
								autoSelect
								autoFocus
							/>
						:	<Text render={<label />} bold style={{ userSelect: 'none' }}>
								{description}
							</Text>
						}
						{!!onQuantityChanged && editing && (
							<NumberStepper
								value={computedQuantity}
								onChange={onQuantityChanged}
								style={{ marginRight: 'auto' }}
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
					</Box>
					<Slider.Base
						className={clsx(completed ? '@mode-accent' : '@mode-primary')}
						value={completedQuantity}
						min={0}
						max={computedQuantity}
						onValueChange={(v) => onCompletionChanged(v as number)}
						style={{
							pointerEvents: 'none',
							width: '100%',
							flexGrow: 1,
							// Fix overflow clipping in Safari
							// https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
							transform: 'translateZ(0)',
						}}
						ref={barRef}
					>
						<Slider.Track className="pointer-events-none">
							<Slider.Indicator className="pointer-events-none transition-all" />
							{new Array(computedQuantity - 1).fill(0).map((_, i) => (
								<Box
									key={i}
									style={{
										pointerEvents: 'none',
										position: 'absolute',
										top: 0,
										height: '100%',
										width: '1px',
										left: `${(100 / computedQuantity) * (i + 1)}%`,
										backgroundColor: 'var(--m-color-neutral-heavy)',
									}}
								/>
							))}
							<Slider.Thumb
								style={{
									pointerEvents: 'initial',
									width: '8px',
								}}
							/>
						</Slider.Track>
					</Slider.Base>
				</Box>
			</Box>
			<Box items="center" justify="between" gap="sm" dim>
				{subline && (
					<Text italic dim emphasis="ambient">
						{subline}
					</Text>
				)}
				<Text italic dim emphasis="ambient" style={{ marginLeft: 'auto' }}>
					{completedQuantity} / {computedQuantity}
				</Text>
			</Box>
		</Box>
	);
}
