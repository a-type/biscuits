import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { ItemSources } from '@/components/groceries/items/ItemSources.jsx';
import { useIsFirstRender, usePrevious } from '@/hooks/usePrevious.js';
import { categorizeOnboarding } from '@/onboarding/categorizeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { useToggleItemPurchased } from '@/stores/groceries/mutations.js';
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
import { OnboardingTooltip, useMergedRef } from '@biscuits/client';
import { useDraggable } from '@dnd-kit/core';
import { Item } from '@gnocchi.biscuits/verdant';
import { motion } from 'motion/react';
import {
	CSSProperties,
	Suspense,
	forwardRef,
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
		}, [isPurchased, id]);

		const [menuOpen, setMenuOpen] = useState(false);

		const sectionStateSnap = useSnapshot(groceriesState);

		const isPartiallyPurchased = false;
		const displayString = useItemDisplayText(item);

		const toggleItemPurchased = useToggleItemPurchased();
		const togglePurchased = async () => {
			await toggleItemPurchased(item);
		};

		const quantityJustChanged = useDidQuantityJustChange(item);

		const sizeRef = useSizeCssVars();

		const finalRef = useMergedRef(ref, sizeRef);

		const subline = useItemSubline(item);

		return (
			<CollapsibleRoot
				className={clsx(
					'item',
					'grid grid-cols-[min-content_1fr_min-content] grid-rows-[min-content_min-content_min-content] grid-areas-[check_main]-[check_comment]-[secondary_secondary]',
					'relative w-full select-none rounded-lg transition ease-springy bg-wash',
					'mt-1',
					'[&[data-dragging=true]]:(cursor-grabbing touch-none border-light shadow-xl)',
					'[&[data-highlighted=true]]:bg-primary-wash',
					'[&[data-menu-open=true]]:(border-light bg-white)',
					isPurchased && 'opacity-90',
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
				data-test="grocery-list-item"
				render={
					<motion.div
						initial={{
							height: 0,
							y: -4,
						}}
						animate={{ height: 'auto', y: 0 }}
						exit={{
							height: 0,
						}}
						transition={{ type: 'spring', duration: 0.2 }}
					>
						<ItemCheckbox
							isPurchased={isPurchased}
							isPartiallyPurchased={isPartiallyPurchased}
							togglePurchased={togglePurchased}
						/>
						<div className="focus:shadow-focus [grid-area:main] relative min-w-0 flex flex-row items-start pb-2 pr-3 pt-2">
							<div
								className={clsx(
									'mr-2 min-w-0 flex flex-1 flex-col items-start gap-1',
									isPurchased && 'item-purchased',
								)}
							>
								<div className="relative mt-1 max-w-full min-w-0 flex flex-row items-start gap-1 overflow-hidden text-ellipsis">
									<span>{displayString}</span>
								</div>
								{isPurchased && (
									<div className="absolute left-0 right-52px top-20px h-1px transform-origin-left animate-expand-scale-x animate-duration-100 animate-ease-out border-0 border-b border-solid border-b-gray-dark" />
								)}
								<CollapsibleSimple
									open={!!subline && !menuOpen && !isPurchased}
									className="[grid-area:comment] self-stretch pl-2 pr-1 text-xs italic color-gray-dark"
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
										className="mr-1 mt-1"
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
									className="relative select-none px-2 py-1"
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
							<CollapsibleTrigger
								render={
									<Button emphasis="ghost" className="flex-shrink-0 p-1" />
								}
							>
								<Icon
									name="chevron"
									className="color-gray-dark [*[data-state=open]_&]:rotate-180deg hover:color-gray-ink"
								/>
							</CollapsibleTrigger>
						</div>
						<CollapsibleContent className="[grid-area:secondary]">
							<Suspense>
								<div className="flex flex-col items-end justify-end gap-2 p-3 pt-0">
									<div className="w-full flex flex-row items-center justify-end gap-3">
										<LiveUpdateTextField
											value={comment || ''}
											onChange={(val) => item.set('comment', val)}
											placeholder="Add a comment"
											className="my-1 min-w-60px flex-shrink-1 flex-grow-2 flex-basis-50% md:flex-grow-3 md:flex-basis-120px important:text-xs important:border-gray-dark"
										/>
										<Suspense>
											<ListSelect
												value={listId}
												onChange={(listId) => item.set('listId', listId)}
												className="flex-shrink-1 flex-grow-1 flex-basis-0"
											/>
										</Suspense>
									</div>
									<div className="w-full flex flex-row items-center justify-end gap-1">
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
												<Icon name="trash" />
											</ItemDeleteButton>
										</Suspense>
									</div>
									<Suspense>
										<ItemSources item={item} />
									</Suspense>
								</div>
							</Suspense>
						</CollapsibleContent>
					</motion.div>
				}
			/>
		);
	},
);

function useDidQuantityJustChange(item: Item) {
	const { totalQuantity } = hooks.useWatch(item);
	const [didQuantityChange, setDidQuantityChange] = useState(false);
	const isFirstRenderRef = useIsFirstRender();
	useEffect(() => {
		if (isFirstRenderRef.current) {
			// nothing
		} else {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setDidQuantityChange(true);
			const timeout = setTimeout(() => setDidQuantityChange(false), 1000);
			return () => clearTimeout(timeout);
		}
	}, [totalQuantity, isFirstRenderRef]);

	return didQuantityChange;
}

export function GroceryListItemDraggable({ item, ...rest }: { item: Item }) {
	const { attributes, listeners, setNodeRef, isDragging, setActivatorNodeRef } =
		useDraggable({
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

	const style = useMemo(
		() => ({
			// transform: transformString,
			opacity: isDragging ? 0.2 : undefined,
		}),
		[isDragging],
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
			checked={isPurchased}
			indeterminate={isPartiallyPurchased}
			onCheckedChange={togglePurchased}
			// prevent click/tap from reaching draggable container -
			// don't disrupt a check action
			onMouseDown={stopPropagation}
			onMouseUp={stopPropagation}
			onPointerDown={stopPropagation}
			onPointerUp={stopPropagation}
			data-test="grocery-list-item-checkbox"
			className={clsx('[grid-area:check] mx-3 mt-2 overflow-hidden')}
		/>
	);
}
