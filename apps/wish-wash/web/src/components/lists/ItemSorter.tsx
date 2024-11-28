import { hooks } from '@/hooks.js';
import { Button, clsx, Dialog, Icon, ScrollArea } from '@a-type/ui';
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
			<Dialog.Content
				disableSheet
				className="left-auto right-2 top-4 translate-0 h-90dvh animate-fade-in-right flex flex-col"
			>
				<Dialog.Title>Reorder items</Dialog.Title>
				<Dialog.Close asChild>
					<Button size="icon" color="ghost" className="absolute top-2 right-2">
						<Icon name="x" />
					</Button>
				</Dialog.Close>
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
						<ScrollArea
							className={clsx('p-1 flex-1', className)}
							background="white"
						>
							{items.map((item, i) => (
								<SortableItem
									item={item}
									key={item.get('id')}
									index={i}
									data-id={item.get('id')}
								/>
							))}
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
	const { id, description } = hooks.useWatch(item);

	return (
		<div ref={ref} className="row p-4 rounded-md bg-wash mb-2" {...rest}>
			<Icon name="grabby" className="mr-2" {...handleProps} />
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
