import { CategoryClaim } from '@/components/groceries/categories/CategoryClaim.jsx';
import {
	CategoryTitle,
	CategoryTitleRow,
} from '@/components/groceries/categories/CategoryTitleRow.jsx';
import { useSizeCssVars, withClassName } from '@a-type/ui';
import { useMergedRef } from '@biscuits/client';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { Category, Item } from '@gnocchi.biscuits/verdant';
import { AnimatePresence } from 'motion/react';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useIsDragging } from '../dndHooks.js';
import { GroceryListItemDraggable } from '../items/GroceryListItem.js';
import cls from './GroceryListCategory.module.css';

const EMPTY_DROPPABLE_SIZE = 48;

export function GroceryListCategory({
	category,
	items,
	...rest
}: {
	category: Category | null;
	items: Item[];
}) {
	const { empty, mountedEmpty, justMounted } =
		useCategoryItemVisibilityState(items);

	const isDragging = useIsDragging();
	const internalRef = useRef<HTMLDivElement>(null);

	useDragExpansion({ internalRef, empty });

	const { setNodeRef, isOver } = useDroppable({
		id: category?.get('id') || 'null',
		data: {
			type: 'category',
			value: category?.get('id'),
		},
		resizeObserverConfig: {
			timeout: 200,
			updateMeasurementsFor: [],
		},
	});

	const measureRef = useSizeCssVars(300);

	const finalRef = useMergedRef(internalRef, setNodeRef, measureRef);

	return (
		<CategoryRoot
			className={'groceryCategory'}
			data-dragged-over={isOver}
			data-is-item-dragging={isDragging}
			data-is-empty={empty}
			data-do-not-animate={justMounted}
			data-pop-in={mountedEmpty && !empty}
			ref={finalRef}
			{...rest}
		>
			<CategoryTitleRow style={{ position: 'relative' }}>
				<CategoryTitle>
					{category?.get('name') ?? 'Uncategorized'}
				</CategoryTitle>
				{category && (
					<div className={cls.claim}>
						<CategoryClaim category={category} />
					</div>
				)}
			</CategoryTitleRow>
			<CategoryItems data-is-item-dragging={isDragging}>
				<AnimatePresence initial={true}>
					{items.map((item) => {
						return <MemoizedDraggableItem key={item.get('id')} item={item} />;
					})}
				</AnimatePresence>
			</CategoryItems>
		</CategoryRoot>
	);
}

export const CategoryRoot = withClassName('div', cls.root);

export const CategoryItems = withClassName('div', cls.items);

function waitForAnimationCancel(animation: Animation) {
	return new Promise((resolve) => {
		animation.cancel();
		animation.addEventListener('cancel', resolve);
	});
}

const animationTiming = 200;
/**
 * Controls the animation of expanding and collapsing hidden categories
 * while the user is dragging
 */
function useDragExpansion({
	internalRef,
	empty,
}: {
	internalRef: React.RefObject<HTMLDivElement | null>;
	empty: boolean;
}) {
	const heightPriorToDragRef = useRef(0);
	const priorAnimationRef = useRef<Animation>(undefined);

	const collapse = useCallback(async () => {
		const element = internalRef.current;
		if (!element) return;

		priorAnimationRef.current?.cancel();

		for (const animation of element.getAnimations()) {
			await waitForAnimationCancel(animation);
		}

		element.animate(
			[
				{
					opacity: 1,
					height: `${EMPTY_DROPPABLE_SIZE}px`,
				},
				{
					opacity: empty ? 0 : 1,
					height: `${empty ? 0 : heightPriorToDragRef.current}px`,
				},
			],
			{
				duration: animationTiming,
				iterations: 1,
				easing: 'ease-in-out',
				fill: 'auto',
			},
		);
	}, [empty, internalRef]);

	useDndMonitor({
		onDragStart: () => {
			const element = internalRef.current;
			if (!element) return;

			heightPriorToDragRef.current = element.clientHeight;

			priorAnimationRef.current = element.animate(
				[
					{
						height: `${element.clientHeight}px`,
						opacity: empty ? 0 : 1,
						marginBottom: empty ? 0 : '16px',
					},
					{
						height: `${EMPTY_DROPPABLE_SIZE}px`,
						opacity: 1,
						marginBottom: '16px',
					},
				],
				{
					duration: animationTiming,
					iterations: 1,
					easing: 'ease-in-out',
					fill: 'forwards',
				},
			);
		},
		onDragEnd: collapse,
		onDragCancel: collapse,
	});
}

const MemoizedDraggableItem = memo(GroceryListItemDraggable);

function useCategoryItemVisibilityState(items: Item[]) {
	const empty = items.length === 0;
	const justMounted = useRef(true);
	useEffect(() => {
		justMounted.current = false;
	}, []);
	const mountedEmpty = useRef(empty);

	// eslint-disable-next-line react-hooks/refs
	return {
		empty,
		// eslint-disable-next-line react-hooks/refs
		mountedEmpty: mountedEmpty.current,
		// eslint-disable-next-line react-hooks/refs
		justMounted: justMounted.current,
	};
}
