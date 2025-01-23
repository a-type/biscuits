import { Icon } from '@/components/icons/Icon.jsx';
import { ActionButton } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { groceriesState } from '../state.js';

export interface ClearPurchasedActionProps {}

export function ClearPurchasedAction({}: ClearPurchasedActionProps) {
	const { purchasedThisSession } = useSnapshot(groceriesState);
	return (
		<ActionButton
			size="small"
			onClick={() => {
				groceriesState.purchasedThisSession.clear();
			}}
			visible={purchasedThisSession.size > 0}
		>
			<Icon name="check" />
			Clear purchased
		</ActionButton>
	);
}
