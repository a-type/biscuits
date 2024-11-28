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
			icon={<Icon name="check" />}
			visible={purchasedThisSession.size > 0}
		>
			Clear purchased
		</ActionButton>
	);
}
