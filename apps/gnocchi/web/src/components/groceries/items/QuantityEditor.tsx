import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	clsx,
	Dialog,
	Icon,
	LiveUpdateTextField,
	NumberStepper,
} from '@a-type/ui';
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
			<Dialog.Trigger
				render={
					<Button
						className={clsx('p-1 font-normal', className)}
						emphasis="ghost"
					/>
				}
			>
				<Icon name="pencil" />
				<span>Edit</span>
			</Dialog.Trigger>
			<Dialog.Content initialFocus={false}>
				<Dialog.Title>Edit item</Dialog.Title>
				<div className="flex flex-row flex-wrap items-center justify-center gap-4">
					<LiveUpdateTextField
						placeholder={displayText}
						value={textOverride || ''}
						onChange={(v) => item.set('textOverride', v)}
						className="flex-1 flex-basis-240px"
					/>
					<NumberStepper
						value={totalQuantity}
						onChange={(v) => item.set('totalQuantity', v)}
						className=""
					/>
				</div>
				<Dialog.Actions>
					<Dialog.Close render={<Button align="end" />}>Done</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
