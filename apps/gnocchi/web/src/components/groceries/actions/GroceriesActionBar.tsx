import { PurchaseAllAction } from '@/components/groceries/actions/PurchaseAllAction.jsx';
import { ActionBar } from '@a-type/ui';
import { ClearPurchasedAction } from './ClearPurchasedAction.jsx';
import { MeetupAction } from './MeetupAction.jsx';
import { RedoAction } from './RedoAction.jsx';
import { UndoAction } from './UndoAction.jsx';

export interface GroceriesActionBarProps {}

export function GroceriesActionBar({}: GroceriesActionBarProps) {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<MeetupAction />
			<PurchaseAllAction />
			<ClearPurchasedAction />
		</ActionBar>
	);
}
