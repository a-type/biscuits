import { FoodName } from '@/components/foods/FoodName.jsx';
import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { groceriesState } from '@/components/groceries/state.js';
import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	CardActions,
	CardFooter,
	CardMain,
	CardRoot,
	CardTitle,
	Chip,
	DatePicker,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
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

	const clearItem = hooks.useClearPantryItem();
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
			<CardRoot
				{...rest}
				className={classNames(
					frozenAt ? 'border-accent-dark' : '',
					leaving && 'animate-fade-out-down animate-forwards',
				)}
			>
				<CardMain compact asChild>
					<OpenFoodDetailButton
						foodName={food}
						className="font-normal p-0 border-none shadow-none rounded-none items-start text-sm"
					>
						<CardTitle className={classNames('text-wrap', 'text-md')}>
							<FoodName food={item} capitalize />
						</CardTitle>
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
					</OpenFoodDetailButton>
				</CardMain>
				<CardFooter className={classNames(showLabels ? 'p-0' : '')}>
					<CardActions
						className={classNames('flex-wrap', {
							'rounded-none p-1': showLabels,
						})}
					>
						<Suspense
							fallback={
								<Button
									size="icon"
									color="default"
									className="w-[32px] h-[32px]"
								/>
							}
						>
							<QuickAddButton food={item} showLabel={showLabels} />
						</Suspense>
						{snoozable && expiresAt && (
							<Button
								size={showLabels ? 'small' : 'icon'}
								color="ghost"
								onClick={snooze}
							>
								<Icon name="clock" />
								{showLabels && <span className="font-normal">Snooze</span>}
							</Button>
						)}
						{inInventory && (
							<Button
								size={showLabels ? 'small' : 'icon'}
								color="ghostDestructive"
								onClick={clear}
							>
								<TrashIcon />
								{showLabels && <span className="font-normal">Used</span>}
							</Button>
						)}
						{(inInventory || !!frozenAt) && (
							<FreezeButton food={item} showLabel={showLabels} />
						)}
					</CardActions>
				</CardFooter>
			</CardRoot>
		</Suspense>
	);
}

export const PantryListItemSkeleton = ({
	showLabels,
}: {
	showLabels?: boolean;
}) => {
	return (
		<CardRoot>
			<CardMain compact>
				<CardTitle>
					<TextSkeleton maxLength={12} />
				</CardTitle>
			</CardMain>
			<CardFooter>
				<CardActions>
					<Button size={showLabels ? 'small' : 'icon'} color="default">
						<Icon name="plus" />
						{showLabels && <TextSkeleton maxLength={8} />}
					</Button>
				</CardActions>
			</CardFooter>
		</CardRoot>
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

	const addItems = hooks.useAddItems();

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
			size={showLabel ? 'small' : 'icon'}
			color="default"
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
				<DialogTrigger asChild>
					<Button size={showLabel ? 'small' : 'icon'} color="accent">
						<Icon name="snowflake" />
						{showLabel && <span className="font-normal">Frozen</span>}
					</Button>
				</DialogTrigger>
				<DialogContent>
					<FrozenTimeAdjuster food={food} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Tooltip content="Mark as frozen" disabled={showLabel}>
			<Button
				size={showLabel ? 'small' : 'icon'}
				color={frozenAt ? 'accent' : 'ghost'}
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
			<DialogTitle>Change freeze time</DialogTitle>
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
			<DialogActions>
				<Button color="destructive" onClick={unfreeze}>
					Unfreeze
				</Button>
				<DialogClose asChild>
					<Button>Close</Button>
				</DialogClose>
			</DialogActions>
		</>
	);
}
