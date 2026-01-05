import { FoodName } from '@/components/foods/FoodName.jsx';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { groceriesState } from '@/components/groceries/state.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	useAddItems,
	useClearPantryItem,
} from '@/stores/groceries/mutations.js';
import {
	Button,
	Card,
	Chip,
	DatePicker,
	Dialog,
	Icon,
	RelativeTime,
	TextSkeleton,
	Tooltip,
} from '@a-type/ui';
import { Food } from '@gnocchi.biscuits/verdant';
import {
	ExclamationTriangleIcon,
	OpenInNewWindowIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';
import { Suspense, useCallback, useState } from 'react';
import { THREE_DAYS_FROM_NOW, useExpiresText } from '../hooks.js';

export interface PantryListItemProps {
	item: Food;
	showLabels?: boolean;
	snoozable?: boolean;
}

export function PantryListItem({
	item,
	showLabels = false,
	snoozable,
	...rest
}: PantryListItemProps) {
	const [leaving, setLeaving] = useState(false);
	const {
		lastPurchasedAt: purchasedAt,
		canonicalName: food,
		expiresAt,
		frozenAt,
		inInventory,
		isStaple,
	} = hooks.useWatch(item);

	const clearItem = useClearPantryItem();
	const clear = () => {
		clearItem(item);
		setLeaving(true);
	};

	// within 3 days
	const isAlmostOrExpired = expiresAt && expiresAt < THREE_DAYS_FROM_NOW;

	const expiresAtText = useExpiresText(item);

	const snooze = useCallback(() => {
		item.set('expiresAt', Date.now() + 6 * 24 * 60 * 60 * 1000);
		setLeaving(true);
	}, [item]);

	return (
		<Suspense>
			<Card
				{...rest}
				className={classNames(
					frozenAt ? 'border-accent-dark' : '',
					leaving && 'animate-fade-out-down animate-forwards',
				)}
			>
				<Card.Main
					compact
					render={
						<OpenFoodDetailButton
							foodName={food}
							emphasis="unstyled"
							className="font-normal p-0 border-none shadow-none rounded-none items-start text-sm"
						/>
					}
				>
					<Card.Title className={classNames('text-wrap', 'text-md')}>
						<FoodName food={item} capitalize />
					</Card.Title>
					<div className="flex flex-row gap-1 items-center flex-wrap p-1 text-xs italic">
						{purchasedAt && (
							<Chip title={new Date(purchasedAt).toLocaleDateString()}>
								<Icon name="clock" />
								<RelativeTime value={purchasedAt} abbreviate />
							</Chip>
						)}
						{purchasedAt && isAlmostOrExpired && !frozenAt && (
							<Tooltip disabled={!expiresAt} content={expiresAtText}>
								<Chip className="important:color-attentionDark">
									<ExclamationTriangleIcon />
									{expiresAtText}
								</Chip>
							</Tooltip>
						)}
						{frozenAt && (
							<Tooltip content="You marked this item as frozen">
								<Chip color="accent">
									<Icon name="snowflake" />
									<RelativeTime value={frozenAt} abbreviate />
								</Chip>
							</Tooltip>
						)}
						{isStaple && (
							<Tooltip content="Staple foods are automatically added to the list when used up">
								<Chip>
									<Icon name="cart" />
									Staple
								</Chip>
							</Tooltip>
						)}
					</div>
					<OpenInNewWindowIcon className="absolute right-2 top-2 z-1 color-gray-dark opacity-50" />
				</Card.Main>
				<Card.Footer className={classNames(showLabels ? 'p-0' : '')}>
					<Card.Actions
						className={classNames('flex-wrap', {
							'rounded-none p-1 border-b-none border-l-none border-r-none':
								showLabels,
						})}
					>
						<Suspense
							fallback={
								<Button emphasis="default" className="w-[32px] h-[32px]" />
							}
						>
							<QuickAddButton food={item} showLabel={showLabels} />
						</Suspense>
						{snoozable && expiresAt && (
							<Button
								size={showLabels ? 'small' : 'default'}
								emphasis="ghost"
								onClick={snooze}
							>
								<Icon name="clock" />
								{showLabels && <span className="font-normal">Snooze</span>}
							</Button>
						)}
						{inInventory && (
							<Button
								size={showLabels ? 'small' : 'default'}
								color="attention"
								emphasis="ghost"
								onClick={clear}
							>
								<TrashIcon />
								{showLabels && <span className="font-normal">Used</span>}
							</Button>
						)}
						{(inInventory || !!frozenAt) && (
							<FreezeButton food={item} showLabel={showLabels} />
						)}
					</Card.Actions>
				</Card.Footer>
			</Card>
		</Suspense>
	);
}

export const PantryListItemSkeleton = ({
	showLabels,
}: {
	showLabels?: boolean;
}) => {
	return (
		<Card>
			<Card.Main compact>
				<Card.Title>
					<TextSkeleton maxLength={12} />
				</Card.Title>
			</Card.Main>
			<Card.Footer>
				<Card.Actions>
					<Button size={showLabels ? 'small' : 'default'} emphasis="default">
						<Icon name="plus" />
						{showLabels && <TextSkeleton maxLength={8} />}
					</Button>
				</Card.Actions>
			</Card.Footer>
		</Card>
	);
};

const QuickAddButton = ({
	food,
	showLabel,
}: {
	food: Food;
	showLabel: boolean;
}) => {
	const { canonicalName: foodName } = hooks.useWatch(food);

	const addItems = useAddItems();

	const repurchaseItem = useCallback(async () => {
		addItems([food.get('canonicalName')], {
			listId: food.get('defaultListId') || null,
		});
		groceriesState.justAddedSomething = true;
	}, [addItems, food]);

	const matchingItem = hooks.useOneItem({
		index: {
			where: 'purchased_food_listId',
			match: {
				purchased: 'no',
				food: foodName,
			},
			order: 'asc',
		},
	});
	const isOnList = !!matchingItem;

	return (
		<Button
			size={showLabel ? 'small' : 'default'}
			emphasis="default"
			onClick={repurchaseItem}
			disabled={isOnList}
		>
			{isOnList ? <Icon name="check" /> : <Icon name="plus" />}
			{showLabel && (
				<span className="font-normal">
					{isOnList ? 'In list' : 'Buy again'}
				</span>
			)}
		</Button>
	);
};

const FreezeButton = ({
	food,
	showLabel,
}: {
	food: Food;
	showLabel: boolean;
}) => {
	const { frozenAt } = hooks.useWatch(food);

	if (frozenAt) {
		return (
			<Dialog>
				<Dialog.Trigger
					render={
						<Button
							size={showLabel ? 'small' : 'default'}
							emphasis="light"
							color="accent"
						/>
					}
				>
					<Icon name="snowflake" />
					{showLabel && <span className="font-normal">Frozen</span>}
				</Dialog.Trigger>
				<Dialog.Content>
					<FrozenTimeAdjuster food={food} />
				</Dialog.Content>
			</Dialog>
		);
	}

	return (
		<Tooltip content="Mark as frozen" disabled={showLabel}>
			<Button
				size={showLabel ? 'small' : 'default'}
				color="accent"
				emphasis={frozenAt ? 'light' : 'ghost'}
				onClick={() => {
					food.update({
						frozenAt: Date.now(),
						expiresAt: null,
					});
				}}
			>
				<Icon name="snowflake" />
				{showLabel && <span className="font-normal">Frozen</span>}
			</Button>
		</Tooltip>
	);
};

function FrozenTimeAdjuster({ food: item }: { food: Food }) {
	const { frozenAt } = hooks.useWatch(item);
	const frozenAtDate = frozenAt ? new Date(frozenAt) : null;

	const unfreeze = useCallback(() => {
		item.set('frozenAt', null);
	}, [item]);

	return (
		<>
			<Dialog.Title>Change freeze time</Dialog.Title>
			<DatePicker
				className="self-center"
				value={frozenAtDate}
				onChange={(date) => {
					if (!date) return;
					const now = new Date();
					date.setHours(now.getHours(), now.getMinutes(), 0);
					item.set('frozenAt', date?.getTime());
				}}
			/>
			<Dialog.Actions>
				<Button emphasis="primary" color="attention" onClick={unfreeze}>
					Unfreeze
				</Button>
				<Dialog.Close />
			</Dialog.Actions>
		</>
	);
}
