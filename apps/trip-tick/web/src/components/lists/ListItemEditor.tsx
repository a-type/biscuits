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
	Box,
	Field,
	Icon,
	LiveUpdateTextField,
	NumberStepper,
	Select,
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
		<Box col gap full="width">
			<Field stretch id="description">
				<Field.Label>Description</Field.Label>
				<Field.Control
					render={
						<LiveUpdateTextField
							value={description}
							onChange={(v) => item.set('description', v)}
							autoSelect
						/>
					}
				/>
			</Field>
			<Field id="quantity">
				<Field.Label>Pack</Field.Label>
				<Field.Control
					render={
						<NumberStepper
							increment={1}
							value={quantity}
							onChange={(v) => {
								if (v > 0) item.set('quantity', v);
							}}
						/>
					}
				/>
			</Field>
			<OnboardingTooltip
				onboarding={firstList}
				step="conditions"
				content="Set rules for how many of this item you want to pack for each trip"
			>
				<Field>
					<Field.Label htmlFor="periodMultiplier">for every</Field.Label>
					<Field.Control>
						<Box gap>
							<NumberStepper
								value={periodMultiplier}
								increment={1}
								onChange={(v) => {
									if (v >= 0) item.set('periodMultiplier', v);
								}}
								disabled={period === 'trip'}
								id="periodMultiplier"
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
								<Select.Trigger />
								<Select.Content>
									{Object.entries(periodNames).map(([key, value]) => (
										<Select.Item value={key} key={key}>
											{pluralize(value, periodMultiplier)}
										</Select.Item>
									))}
								</Select.Content>
							</Select>
						</Box>
					</Field.Control>
					<Field.Description>
						include items once for the whole trip, or based on the trip length
					</Field.Description>
				</Field>
			</OnboardingTooltip>
			<Field id="additional">
				<Field.Label>plus</Field.Label>
				<Field.Control
					render={
						<NumberStepper
							value={additional}
							onChange={(v) => {
								if (v < 0) return;
								item.set('additional', v);
							}}
							className="bg-white"
							renderValue={(d) => (d === 0 ? 'None' : `${d} / trip`)}
						/>
					}
				/>
				<Field.Description>
					add additional items for each trip, regardless of trip length
				</Field.Description>
			</Field>
			{isSubscribed && (
				<Field>
					<Field.Label>when...</Field.Label>
					<Field.Control render={<ListItemConditionsEditor item={item} />} />
					<Field.Description>
						conditions limit how the item is included based on weather
					</Field.Description>
				</Field>
			)}
			{periodMultiplier > 1 && (
				<Field id="round">
					<Field.Label>rounded</Field.Label>
					<Field.Control
						render={
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
						}
					/>
					<Field.Description>
						what to do when a trip has an odd number of{' '}
						{period === 'night' ? 'nights' : 'days'}
					</Field.Description>
				</Field>
			)}
		</Box>
	);
}
