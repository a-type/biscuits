import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { ItemSources } from '@/components/groceries/items/ItemSources.jsx';
import { Link } from '@/components/nav/Link.jsx';
import { usePurchasedText } from '@/components/pantry/hooks.js';
import {
	PeopleList,
	PeopleListItem,
} from '@/components/sync/people/People.jsx';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.js';
import { useListId } from '@/contexts/ListContext.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { useIsFirstRender, usePrevious } from '@/hooks/usePrevious.js';
import { categorizeOnboarding } from '@/onboarding/categorizeOnboarding.js';
import { Person, hooks } from '@/stores/groceries/index.js';
import {
	Button,
	CheckboxIndicator,
	CheckboxRoot,
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleSimple,
	CollapsibleTrigger,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Icon,
	LiveUpdateTextField,
	NumberStepper,
	Tooltip,
	clsx,
	useParticles,
	useSizeCssVars,
} from '@a-type/ui';
import { preventDefault, stopPropagation } from '@a-type/utils';
import { OnboardingTooltip } from '@biscuits/client';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Item } from '@gnocchi.biscuits/verdant';
import { ClockIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import {
	CSSProperties,
	Suspense,
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useSnapshot } from 'valtio';
import { ListSelect } from '../lists/ListSelect.jsx';
import { useListOrNull, useListThemeClass } from '../lists/hooks.js';
import { groceriesState } from '../state.js';
import './GroceryListItem.css';
import { ItemDeleteButton } from './ItemDeleteButton.js';
import { useItemDisplayText, useItemSubline } from './hooks.js';

export interface GroceryListItemProps {
	className?: string;
	item: Item;
	isDragActive?: boolean;
	style?: CSSProperties;
	menuProps?: any;
}

export const GroceryListItem = forwardRef<HTMLDivElement, GroceryListItemProps>(
	function GroceryListItem(
		{ item, isDragActive, menuProps, className, ...rest },
		ref,
	) {
		const { purchasedAt, comment, id, food } = hooks.useWatch(item);

		const isPurchased = !!purchasedAt;

		// TODO: clean this up
		const purchasedHiddenState = 'visible';

		const previousPurchasedAt = usePrevious(isPurchased);
		const wasPurchasedSinceMount = isPurchased && !previousPurchasedAt;
		useEffect(() => {
			if (wasPurchasedSinceMount) {
				groceriesState.purchasedThisSession.add(id);
			}
		}, [wasPurchasedSinceMount, id]);
		useEffect(() => {
			if (!isPurchased) {
				groceriesState.purchasedThisSession.delete(id);
			}
		}, [isPurchased]);

		const [menuToggleOpen, setMenuOpen] = useState(false);
		const menuOpen = menuToggleOpen && purchasedHiddenState === 'visible';

		const sectionStateSnap = useSnapshot(groceriesState);

		const isPartiallyPurchased = false;
		const displayString = useItemDisplayText(item);

		const toggleItemPurchased = hooks.useToggleItemPurchased();
		const togglePurchased = useCallback(async () => {
			await toggleItemPurchased(item);
		}, [item]);

		const quantityJustChanged = useDidQuantityJustChange(item);
		const justMoved = useDidJustMove(item);

		const sizeRef = useSizeCssVars();

		const finalRef = useMergedRef(ref, sizeRef);

		const subline = useItemSubline(item);

		return (
			<CollapsibleRoot
				className={clsx(
					'item',
					'grid grid-areas-[check_main]-[check_comment]-[secondary_secondary] grid-cols-[min-content_1fr_min-content] grid-rows-[min-content_min-content_min-content]',
					'w-full bg-wash rounded-lg relative select-none transition ease-springy',
					'mt-1',
					'[&[data-dragging=true]]:(shadow-xl cursor-grabbing touch-none border-light)',
					'[&[data-highlighted=true]]:bg-primary-wash',
					'[&[data-menu-open=true]]:(bg-white border-light)',
					'[&[data-just-moved=true][data-hidden-state=visible]]:(animate-keyframes-pop-up animate-duration-400)',
					'[&[data-hidden-state=hidden]]:(animate-item-disappear animate-mode-forwards)',
					className,
				)}
				open={menuOpen}
				onOpenChange={setMenuOpen}
				hidden={sectionStateSnap.newCategoryPendingItem?.get('id') === id}
				{...rest}
				ref={finalRef}
				data-highlighted={quantityJustChanged}
				data-dragging={isDragActive}
				data-item-id={id}
				data-oid={(item as any).oid}
				data-menu-open={menuOpen}
				data-just-moved={justMoved}
				data-hidden-state={purchasedHiddenState}
				data-test="grocery-list-item"
			>
				<ItemCheckbox
					isPurchased={isPurchased}
					isPartiallyPurchased={isPartiallyPurchased}
					togglePurchased={togglePurchased}
				/>
				<div className="flex flex-row items-start [grid-area:main] pt-2 pr-3 pb-2 relative focus:(shadow-focus)">
					<div
						className={clsx(
							'flex flex-col gap-1 items-start flex-1 mr-2',
							isPurchased && 'item-purchased',
						)}
					>
						<div className="flex flex-row items-start gap-1 mt-1 max-w-full overflow-hidden text-ellipsis relative">
							<span>{displayString}</span>
						</div>
						{isPurchased && (
							<div className="absolute left-0 right-52px top-20px border-0 border-b border-b-gray5 border-solid h-1px transform-origin-left animate-expand-scale-x animate-duration-100 animate-ease-out" />
						)}
						<CollapsibleSimple
							open={!!subline && !menuOpen && !isPurchased}
							className="text-xs text-gray-6 italic pl-2 pr-1 self-stretch [grid-area:comment]"
						>
							{subline}
						</CollapsibleSimple>
					</div>
					<RecentPeople item={item} className="mr-1" />
					<Suspense>
						<ListTag item={item} collapsed={menuOpen} className="mr-1" />
					</Suspense>
					{!isPurchased && (
						<Suspense>
							<RecentPurchaseHint
								compact
								className="mt-1 mr-1"
								foodName={food}
							/>
						</Suspense>
					)}
					<div
						onTouchStart={stopPropagation}
						onTouchMove={stopPropagation}
						onTouchEnd={stopPropagation}
						onPointerDown={stopPropagation}
						onPointerMove={stopPropagation}
						onPointerUp={stopPropagation}
						className="mr-1"
					>
						<div
							className="relative py-1 px-2 select-none"
							onContextMenu={preventDefault}
							{...menuProps}
						>
							<OnboardingTooltip
								onboarding={categorizeOnboarding}
								step="categorize"
								content="Tap and hold to change category"
								disableNext
							>
								<Icon name="grabby" className="text-gray-5" />
							</OnboardingTooltip>
						</div>
					</div>
					<CollapsibleTrigger asChild>
						<Button size="icon" color="ghost" className="p-1 flex-shrink-0">
							<Icon
								name="chevron"
								className="[*[data-state=open]_&]:rotate-180deg text-gray-5 hover:text-gray-7"
							/>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className="[grid-area:secondary]">
					<Suspense>
						<div className="flex flex-col gap-2 justify-end p-3 pt-0 items-end">
							<div className="flex flex-row gap-3 justify-end w-full items-center">
								<LiveUpdateTextField
									value={comment || ''}
									onChange={(val) => item.set('comment', val)}
									placeholder="Add a comment"
									className="important:text-xs important:border-gray5 flex-grow-2 flex-shrink-1 flex-basis-50% md:flex-basis-120px my-1"
								/>
								<ListSelect
									value={item.get('listId')}
									onChange={(listId) => item.set('listId', listId)}
									className="flex-basis-25% flex-grow-1 flex-shrink-1 md:flex-basis-80px"
								/>
							</div>
							<div className="flex flex-row gap-1 justify-end w-full items-center">
								<QuantityEditor className="mr-auto" item={item} />
								<Suspense>
									<RecentPurchaseHint
										foodName={food}
										className="flex-basis-50% justify-end"
									/>
								</Suspense>
								<OpenFoodDetailButton foodName={food} />
								{/* <CategoryPicker item={item} /> */}
								<ItemDeleteButton
									size="icon"
									color="ghostDestructive"
									item={item}
								>
									<TrashIcon />
								</ItemDeleteButton>
							</div>
							<ItemSources item={item} />
						</div>
					</Suspense>
				</CollapsibleContent>
			</CollapsibleRoot>
		);
	},
);

function useDidJustMove(item: Item) {
	const { justMovedItemId } = useSnapshot(groceriesState);
	return justMovedItemId === item.get('id');
}

function useDidQuantityJustChange(item: Item) {
	const { totalQuantity } = hooks.useWatch(item);
	const [didQuantityChange, setDidQuantityChange] = useState(false);
	const isFirstRenderRef = useIsFirstRender();
	useEffect(() => {
		if (isFirstRenderRef.current) {
			// nothing
		} else {
			setDidQuantityChange(true);
			const timeout = setTimeout(() => setDidQuantityChange(false), 1000);
			return () => clearTimeout(timeout);
		}
	}, [totalQuantity, isFirstRenderRef]);

	return didQuantityChange;
}

export function GroceryListItemDraggable({ item, ...rest }: { item: Item }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		isDragging,
		setActivatorNodeRef,
	} = useDraggable({
		id: item.get('id'),
		data: {
			type: 'item',
			value: item,
		},
	});

	const handleProps = useMemo(
		() => ({
			...listeners,
			...attributes,
			style: {
				cursor: isDragging ? 'grabbing' : 'grab',
				touchAction: 'none',
			},
			ref: setActivatorNodeRef,
		}),
		[listeners, attributes, setActivatorNodeRef, isDragging],
	);

	const transformString = CSS.Transform.toString(transform);
	const style = useMemo(
		() => ({
			// transform: transformString,
			opacity: isDragging ? 0.2 : undefined,
		}),
		[isDragging, transformString],
	);

	return (
		<GroceryListItem
			item={item}
			ref={setNodeRef}
			style={style}
			menuProps={handleProps}
			{...rest}
		/>
	);
}

function RecentPeople({ item, className }: { item: Item; className?: string }) {
	const people = usePeopleWhoLastEditedThis(item.get('id'));

	if (people.length === 0) {
		return null;
	}

	return (
		<PeopleList count={people.length} className={className}>
			{people.map((person, index) => (
				<PeopleListItem index={index} key={person.profile.id}>
					<PersonAvatar
						key={person.profile.id}
						person={person}
						className="relative z-[var(--index)] left-[calc(var(--index)*-8px)]"
					/>
				</PeopleListItem>
			))}
		</PeopleList>
	);
}

function usePeopleWhoLastEditedThis(itemId: string) {
	const groceries = hooks.useClient();
	const [people, setPeople] = useState<Person[]>(() => {
		return Object.values(groceries.sync.presence.peers).filter(
			(p) => p.presence.lastInteractedItem === itemId,
		);
	});
	useEffect(() => {
		return groceries.sync.presence.subscribe('peersChanged', () => {
			setPeople(
				Object.values(groceries.sync.presence.peers).filter(
					(p) => p.presence.lastInteractedItem === itemId,
				),
			);
		});
	}, []);

	return people;
}

function ListTag({
	item,
	collapsed,
	className,
}: {
	item: Item;
	collapsed?: boolean;
	className?: string;
}) {
	const filteredListId = useListId();

	const { listId } = hooks.useWatch(item);

	const list = useListOrNull(listId);
	const listThemeClass = useListThemeClass(listId);

	if (filteredListId !== undefined) {
		// only show list tag when showing all items
		return null;
	}

	if (!list) {
		return null;
	}

	const name = list.get('name');

	return (
		<Tooltip content={list.get('name')}>
			<CollapsibleRoot open={!collapsed} className={className}>
				<CollapsibleContent
					data-horizontal
					className="rounded-md focus-within:(outline-none shadow-focus)"
				>
					<Link
						to={`/list/${list.get('id')}`}
						className="focus-visible:outline-none"
					>
						<div
							className={clsx(
								listThemeClass,
								'flex items-center justify-center p-1 color-black rounded-md bg-primary-light text-xs min-w-3 min-h-3 gap-1 lg:px-2',
							)}
						>
							<Icon name="tag" className="inline" />
							<span className="hidden whitespace-nowrap overflow-hidden text-ellipsis max-w-full lg:inline">
								{name}
							</span>
							<span className="inline whitespace-nowrap overflow-hidden text-ellipsis max-w-full lg:hidden">
								{getInitials(name).toUpperCase()}
							</span>
						</div>
					</Link>
				</CollapsibleContent>
			</CollapsibleRoot>
		</Tooltip>
	);
}

function getInitials(name: string) {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('');
}

function QuantityEditor({
	item,
	className,
}: {
	item: Item;
	className?: string;
}) {
	const { totalQuantity, textOverride } = hooks.useWatch(item);
	const displayText = useItemDisplayText(item);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="icon"
					className={clsx('p-1 font-normal', className)}
					color="ghost"
				>
					<Pencil1Icon />
					<span>Edit</span>
				</Button>
			</DialogTrigger>
			<DialogContent onOpenAutoFocus={preventDefault}>
				<DialogTitle>Edit item</DialogTitle>
				<div className="flex flex-row items-center justify-center gap-4 flex-wrap">
					<LiveUpdateTextField
						placeholder={displayText}
						value={textOverride || ''}
						onChange={(v) => item.set('textOverride', v)}
						className="flex-basis-240px flex-1"
					/>
					<NumberStepper
						value={totalQuantity}
						onChange={(v) => item.set('totalQuantity', v)}
						className=""
					/>
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button align="end">Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function ItemCheckbox({
	isPurchased,
	isPartiallyPurchased,
	togglePurchased,
}: {
	isPurchased: boolean;
	isPartiallyPurchased: boolean;
	togglePurchased: () => void;
}) {
	const ref = useRef<HTMLButtonElement>(null);
	const particles = useParticles();

	useEffect(() => {
		if (isPurchased && ref.current) {
			particles?.addParticles(
				particles.elementExplosion({
					element: ref.current,
					count: 20,
				}),
			);
		}
	}, [isPurchased, particles]);

	return (
		<CheckboxRoot
			ref={ref}
			checked={
				isPurchased ? true : isPartiallyPurchased ? 'indeterminate' : false
			}
			onCheckedChange={togglePurchased}
			// prevent click/tap from reaching draggable container -
			// don't disrupt a check action
			onMouseDown={stopPropagation}
			onMouseUp={stopPropagation}
			onPointerDown={stopPropagation}
			onPointerUp={stopPropagation}
			data-test="grocery-list-item-checkbox"
			className={clsx(
				'[grid-area:check] mt-2 mx-3 overflow-hidden',
				isPurchased && 'checkbox-purchased',
			)}
		>
			<CheckboxIndicator />
		</CheckboxRoot>
	);
}

function useFood(foodName: string) {
	return hooks.useOneFood({
		index: {
			where: 'anyName',
			equals: foodName,
		},
	});
}

function RecentPurchaseHint({
	foodName,
	compact,
	className,
}: {
	foodName: string;
	compact?: boolean;
	className?: string;
}) {
	const food = useFood(foodName);
	hooks.useWatch(food);

	const lastPurchasedAt = food?.get('lastPurchasedAt');
	const expiresAt = food?.get('expiresAt');
	const hasExpiration = !!food?.get('expiresAfterDays');
	const inInventory = food?.get('inInventory');

	const purchasedText = usePurchasedText(food, true);

	if (!food) {
		return null;
	}

	// no need to warn if the item was used; might as well rebuy if needed
	if (!inInventory) {
		return null;
	}

	const isExpired =
		// items without expirations are not expired
		!!expiresAt &&
		// items whose purchase date is within the expiration window are not expired
		expiresAt < Date.now();

	// also show warning for non-perishable (no expiration) that were
	// bought in the last week
	const wasBoughtThisWeek =
		lastPurchasedAt && lastPurchasedAt > Date.now() - 1000 * 60 * 60 * 24 * 7;

	// only show small version if the food isn't yet expired
	if (compact && (isExpired || (!hasExpiration && !wasBoughtThisWeek))) {
		return null;
	}

	if (compact) {
		return (
			<Tooltip content={purchasedText}>
				<ClockIcon className={clsx('color-primary-dark', className)} />
			</Tooltip>
		);
	}

	// only show the large version if it was purchased at all
	if (!lastPurchasedAt) return null;

	return (
		<div
			className={clsx(
				'text-xs text-gray-7 italic flex flex-row gap-1 items-center',
				className,
			)}
		>
			<ClockIcon />
			<span>{purchasedText}</span>
		</div>
	);
}
