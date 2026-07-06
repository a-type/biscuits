import { hooks } from '@/hooks.js';
import { Dialog, Icon, ScrollArea } from '@a-type/ui';
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Item, List } from '@wish-wash.biscuits/verdant';
import { CSSProperties, forwardRef, useCallback, useState } from 'react';
import { ItemTypeChip } from '../items/ItemTypeChip.jsx';
import { useReordering } from './hooks.js';
import cls from './ItemSorter.module.css';

export interface ItemSorterProps {
	list: List;
	className?: string;
}

export function ItemSorter({ list, className }: ItemSorterProps) {
	const { items } = hooks.useWatch(list);
	hooks.useWatch(items);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [draggingId, setDraggingId] = useState<string | number | null>(null);

	const handleDragStart = useCallback(({ active }: DragStartEvent) => {
		setDraggingId(active.id);
	}, []);

	const handleDragEnd = useCallback(
		({ active, over }: DragEndEvent) => {
			setDraggingId(null);
			if (!over) return;
			if (active.id !== over.id) {
				const fromIndex = active.data.current?.index;
				const toIndex = over.data.current?.index;

				items.move(fromIndex, toIndex);
			}
		},
		[items],
	);

	const draggingItem = items.find((i) => i.get('id') === draggingId);

	const [reordering, setReordering] = useReordering();

	return (
		<Dialog open={reordering} onOpenChange={setReordering}>
			<Dialog.Content disableSheet className={cls.dialog}>
				<Dialog.Title>Reorder items</Dialog.Title>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={items.map((i) => i.get('id'))}
						strategy={verticalListSortingStrategy}
					>
						<ScrollArea style={{ flex: 1 }} className={className}>
							<ScrollArea.Content className={cls.content}>
								{items.map((item, i) => (
									<SortableItem
										item={item}
										key={item.get('id')}
										index={i}
										data-id={item.get('id')}
									/>
								))}
							</ScrollArea.Content>
						</ScrollArea>
						<DragOverlay>
							{draggingItem && <SorterItem item={draggingItem} />}
						</DragOverlay>
					</SortableContext>
				</DndContext>
			</Dialog.Content>
		</Dialog>
	);
}

const SorterItem = forwardRef<
	HTMLDivElement,
	{ item: Item; style?: CSSProperties; handleProps?: any }
>(function SorterItem({ item, handleProps, ...rest }, ref) {
	const { description } = hooks.useWatch(item);

	return (
		<div ref={ref} className={cls.item} {...rest}>
			<Icon name="grabby" className={cls.grabby} {...handleProps} />
			<ItemTypeChip item={item} />
			<div>{description}</div>
		</div>
	);
});

const SortableItem = ({ index, item }: { item: Item; index: number }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item.get('id'), data: { index } });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<SorterItem
			ref={setNodeRef}
			style={style}
			handleProps={{
				...attributes,
				...listeners,
			}}
			item={item}
		/>
	);
};
