import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
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
				render={<Button className={className} size="small" emphasis="ghost" />}
			>
				<Icon name="pencil" />
				<span>Edit</span>
			</Dialog.Trigger>
			<Dialog.Content initialFocus={false}>
				<Dialog.Title>Edit item</Dialog.Title>
				<Box wrap items="center" justify="center" gap>
					<LiveUpdateTextField
						placeholder={displayText}
						value={textOverride || ''}
						onChange={(v) => item.set('textOverride', v)}
						style={{ flex: 1, flexBasis: 240 }}
					/>
					<NumberStepper
						value={totalQuantity}
						onChange={(v) => item.set('totalQuantity', v)}
					/>
				</Box>
				<Dialog.Actions>
					<Dialog.Close render={<Button style={{ alignSelf: 'end' }} />}>
						Done
					</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
