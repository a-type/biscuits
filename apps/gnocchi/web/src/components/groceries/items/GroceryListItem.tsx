import { OpenFoodDetailButton } from '@/components/foods/OpenFoodDetailButton.jsx';
import { ItemSources } from '@/components/groceries/items/ItemSources.jsx';
import { useIsFirstRender, usePrevious } from '@/hooks/usePrevious.js';
import { categorizeOnboarding } from '@/onboarding/categorizeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { useToggleItemPurchased } from '@/stores/groceries/mutations.js';
import {
	Box,
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
import cls from './GroceryListItem.module.css';
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
				className={clsx('item', cls.root, className)}
				open={menuOpen}
				onOpenChange={setMenuOpen}
				hidden={sectionStateSnap.newCategoryPendingItem?.get('id') === id}
				{...rest}
				ref={finalRef}
				data-highlighted={quantityJustChanged}
				data-dragging={isDragActive}
				data-item-id={id}
				data-menu-open={menuOpen}
				data-purchased={isPurchased}
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
						<div className={cls.checkbox}>
							<ItemCheckbox
								isPurchased={isPurchased}
								isPartiallyPurchased={isPartiallyPurchased}
								togglePurchased={togglePurchased}
							/>
						</div>
						<div className={cls.main}>
							<div
								className={clsx(cls.content, isPurchased && 'item-purchased')}
							>
								<div className={cls.name}>
									<span>{displayString}</span>
								</div>
								{isPurchased && <div className={cls.crossout} />}
								<CollapsibleSimple
									open={!!subline && !menuOpen && !isPurchased}
									className={cls.comment}
								>
									{subline}
								</CollapsibleSimple>
							</div>
							<div className={cls.accessories}>
								<RecentPeople item={item} className={cls.accessory} />
								<Suspense>
									<ListTag
										item={item}
										collapsed={menuOpen}
										className={cls.accessory}
									/>
								</Suspense>
								{!isPurchased && (
									<Suspense>
										<RecentPurchaseHint
											compact
											className={cls.accessory}
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
									className={cls.accessory}
								>
									<div
										className={cls.grab}
										onContextMenu={preventDefault}
										{...menuProps}
									>
										<OnboardingTooltip
											onboarding={categorizeOnboarding}
											step="categorize"
											content="Tap and hold to change category"
											disableNext
										>
											<Icon name="grabby" />
										</OnboardingTooltip>
									</div>
								</div>
								<CollapsibleTrigger
									render={
										<Button
											size="small"
											emphasis="ghost"
											className={cls.collapseTrigger}
										/>
									}
								>
									<Icon name="chevron" className="icon" />
								</CollapsibleTrigger>
							</div>
						</div>
						<CollapsibleContent className={cls.secondary}>
							<Suspense>
								<div className={cls.secondaryContent}>
									<div className={cls.commentSection}>
										<LiveUpdateTextField
											value={comment || ''}
											onChange={(val) => item.set('comment', val)}
											placeholder="Add a comment"
											className={clsx(cls.commentField, '@mode-dense')}
										/>
										<Suspense>
											<ListSelect
												value={listId}
												onChange={(listId) => item.set('listId', listId)}
												className={clsx('@mode-denser', cls.listSelect)}
											/>
										</Suspense>
									</div>
									<Box full="width" items="center" justify="end" gap="xs">
										<Suspense>
											<QuantityEditor className={cls.editButton} item={item} />
										</Suspense>
										<Suspense>
											<RecentPurchaseHint
												foodName={food}
												className={clsx('@mode-denser', cls.recentHint)}
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
									</Box>
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
		/>
	);
}
