import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	clsx,
	Dialog,
	Icon,
	LiveUpdateTextField,
	NumberStepper,
} from '@a-type/ui';
import { preventDefault } from '@a-type/utils';
import { Item } from '@gnocchi.biscuits/verdant';
import { useItemDisplayText } from './hooks.js';

export function QuantityEditor({
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
			<Dialog.Trigger asChild>
				<Button className={clsx('p-1 font-normal', className)} emphasis="ghost">
					<Icon name="pencil" />
					<span>Edit</span>
				</Button>
			</Dialog.Trigger>
			<Dialog.Content onOpenAutoFocus={preventDefault}>
				<Dialog.Title>Edit item</Dialog.Title>
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
				<Dialog.Actions>
					<Dialog.Close asChild>
						<Button align="end">Done</Button>
					</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
