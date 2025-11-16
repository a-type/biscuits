import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { ItemSources } from '@/components/groceries/items/ItemSources.jsx';
import useMergedRef from '@/hooks/useMergedRef.js';
import { useIsFirstRender, usePrevious } from '@/hooks/usePrevious.js';
import { categorizeOnboarding } from '@/onboarding/categorizeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Checkbox,
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleSimple,
	CollapsibleTrigger,
	Icon,
	LiveUpdateTextField,
	clsx,
	useParticles,
	useSizeCssVars,
} from '@a-type/ui';
import { preventDefault, stopPropagation } from '@a-type/utils';
import { OnboardingTooltip } from '@biscuits/client';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Item } from '@gnocchi.biscuits/verdant';
import { TrashIcon } from '@radix-ui/react-icons';
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
import { ListTag } from '../lists/ListTag.jsx';
import { groceriesState } from '../state.js';
import './GroceryListItem.css';
import { useItemDisplayText, useItemSubline } from './hooks.js';
import { ItemDeleteButton } from './ItemDeleteButton.js';
import { QuantityEditor } from './QuantityEditor.jsx';
import { RecentPeople } from './RecentPeople.jsx';
import { RecentPurchaseHint } from './RecentPurchaseHint.jsx';

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
		const { purchasedAt, comment, id, food, listId } = hooks.useWatch(item);

		const isPurchased = !!purchasedAt;

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

		const [menuOpen, setMenuOpen] = useState(false);

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
				data-menu-open={menuOpen}
				data-just-moved={justMoved}
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
							<div className="absolute left-0 right-52px top-20px border-0 border-b border-b-gray-dark border-solid h-1px transform-origin-left animate-expand-scale-x animate-duration-100 animate-ease-out" />
						)}
						<CollapsibleSimple
							open={!!subline && !menuOpen && !isPurchased}
							className="text-xs color-gray-dark italic pl-2 pr-1 self-stretch [grid-area:comment]"
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
								<Icon name="grabby" className="color-gray-dark" />
							</OnboardingTooltip>
						</div>
					</div>
					<CollapsibleTrigger asChild>
						<Button emphasis="ghost" className="p-1 flex-shrink-0">
							<Icon
								name="chevron"
								className="[*[data-state=open]_&]:rotate-180deg color-gray-dark hover:color-gray-ink"
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
									className="important:text-xs important:border-gray-dark flex-grow-2 flex-shrink-1 flex-basis-50% md:flex-basis-120px md:flex-grow-3 my-1"
								/>
								<Suspense>
									<ListSelect
										value={listId}
										onChange={(listId) => item.set('listId', listId)}
										className="flex-basis-25% flex-grow-1 flex-shrink-1 md:flex-basis-60px"
									/>
								</Suspense>
							</div>
							<div className="flex flex-row gap-1 justify-end w-full items-center">
								<Suspense>
									<QuantityEditor className="mr-auto" item={item} />
								</Suspense>
								<Suspense>
									<RecentPurchaseHint
										foodName={food}
										className="flex-basis-50% justify-end"
									/>
								</Suspense>
								<OpenFoodDetailButton foodName={food} />
								<Suspense>
									<ItemDeleteButton
										color="attention"
										emphasis="ghost"
										item={item}
									>
										<TrashIcon />
									</ItemDeleteButton>
								</Suspense>
							</div>
							<Suspense>
								<ItemSources item={item} />
							</Suspense>
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
		<Checkbox
			ref={ref}
			checkedMode="faded"
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
			className={clsx('[grid-area:check] mt-2 mx-3 overflow-hidden')}
		/>
	);
}
