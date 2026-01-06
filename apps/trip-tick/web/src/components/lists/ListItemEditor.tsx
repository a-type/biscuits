import {
	ToggleGroup,
	ToggleItem,
	ToggleItemDescription,
	ToggleItemIndicator,
	ToggleItemLabel,
	ToggleItemTitle,
} from '@/components/ui/ToggleGroup.jsx';
import { firstList } from '@/onboarding/firstList.js';
import { hooks } from '@/store.js';
import {
	Icon,
	LiveUpdateTextField,
	NumberStepper,
	Select,
	withClassName,
} from '@a-type/ui';
import { OnboardingTooltip, useHasServerAccess } from '@biscuits/client';
import { ListItemsItem } from '@trip-tick.biscuits/verdant';
import pluralize from 'pluralize';
import { ListItemConditionsEditor } from './ListItemConditionsEditor.jsx';
import { periodNames } from './utils.js';

export function ListItemEditor({ item }: { item: ListItemsItem }) {
	const {
		description,
		quantity,
		additional,
		periodMultiplier,
		period,
		roundDown,
	} = hooks.useWatch(item);

	const isSubscribed = useHasServerAccess();

	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="flex flex-row justify-between items-center">
				<LiveUpdateTextField
					value={description}
					onChange={(v) => item.set('description', v)}
					className="flex-1"
					autoSelect
				/>
			</div>
			<div className="flex flex-col gap-3 items-start">
				<FieldGroup>
					<FieldLabel className="font-bold">Pack</FieldLabel>
					<FieldArea>
						<NumberStepper
							increment={1}
							value={quantity}
							onChange={(v) => {
								if (v > 0) item.set('quantity', v);
							}}
							className="bg-white"
						/>
					</FieldArea>
				</FieldGroup>
				<OnboardingTooltip
					onboarding={firstList}
					step="conditions"
					content="Set rules for how many of this item you want to pack for each trip"
				>
					<FieldGroup>
						<FieldLabel className="font-bold">for every</FieldLabel>
						<FieldArea>
							<NumberStepper
								value={periodMultiplier}
								increment={1}
								onChange={(v) => {
									if (v >= 0) item.set('periodMultiplier', v);
								}}
								className="bg-white"
								disabled={period === 'trip'}
							/>
							<Select
								value={period}
								onValueChange={(v) => {
									item.set('period', v || undefined);
									if (v === 'trip') {
										item.set('periodMultiplier', 1);
									}
								}}
								itemToStringLabel={(v) => pluralize(v, periodMultiplier)}
							>
								<Select.Trigger className="bg-white justify-between border-default py-1.5 px-4">
									<Select.Value />
									<Select.Icon />
								</Select.Trigger>
								<Select.Content>
									{Object.entries(periodNames).map(([key, value]) => (
										<Select.Item value={key} key={key}>
											{pluralize(value, periodMultiplier)}
										</Select.Item>
									))}
								</Select.Content>
							</Select>
						</FieldArea>
						<FieldDescription>
							include items once for the whole trip, or based on the trip length
						</FieldDescription>
					</FieldGroup>
				</OnboardingTooltip>
				<FieldGroup>
					<FieldLabel>plus</FieldLabel>
					<FieldArea>
						<div className="flex flex-row gap-2 items-center">
							<NumberStepper
								value={additional}
								onChange={(v) => {
									if (v < 0) return;
									item.set('additional', v);
								}}
								className="bg-white"
								renderValue={(d) => (d === 0 ? 'None' : `${d} / trip`)}
							/>
						</div>
					</FieldArea>
					<FieldDescription>
						add additional items for each trip, regardless of trip length
					</FieldDescription>
				</FieldGroup>
				{isSubscribed && (
					<FieldGroup className="grid-col-span-2">
						<FieldLabel>when...</FieldLabel>
						<FieldArea>
							<ListItemConditionsEditor item={item} />
						</FieldArea>
						<FieldDescription>
							conditions limit how the item is included based on weather
						</FieldDescription>
					</FieldGroup>
				)}
			</div>
			<div className="flex flex-col gap-3 items-start p-1">
				{periodMultiplier > 1 && (
					<FieldGroup>
						<FieldLabel>rounded</FieldLabel>
						<FieldArea>
							<ToggleGroup
								value={roundDown ? 'down' : 'up'}
								type="single"
								onValueChange={(v) => {
									item.set('roundDown', v === 'down');
								}}
							>
								<ToggleItem value="down">
									<ToggleItemIndicator>
										<Icon name="check" />
									</ToggleItemIndicator>
									<ToggleItemLabel>
										<ToggleItemTitle>Pack light</ToggleItemTitle>
										<ToggleItemDescription>
											Rounds the number of items down
										</ToggleItemDescription>
									</ToggleItemLabel>
								</ToggleItem>
								<ToggleItem value="up">
									<ToggleItemIndicator>
										<Icon name="check" />
									</ToggleItemIndicator>
									<ToggleItemLabel>
										<ToggleItemTitle>Pack safe</ToggleItemTitle>
										<ToggleItemDescription>
											Rounds the number of items up
										</ToggleItemDescription>
									</ToggleItemLabel>
								</ToggleItem>
							</ToggleGroup>
						</FieldArea>
						<FieldDescription>
							what to do when a trip has an odd number of{' '}
							{period === 'night' ? 'nights' : 'days'}
						</FieldDescription>
					</FieldGroup>
				)}
			</div>
		</div>
	);
}

const FieldGroup = withClassName('div', 'flex flex-col gap-2 items-start');
const FieldLabel = withClassName('label', 'text-sm font-medium font-bold');
const FieldArea = withClassName(
	'div',
	'flex flex-col gap-2 items-start w-full',
);
const FieldDescription = withClassName(
	'div',
	'text-xs italic color-gray-dark my-1',
);
