import { ActionButton } from '@a-type/ui/components/actions';
import { groceriesState } from '../state.js';
import { Icon } from '@/components/icons/Icon.jsx';
import { useSnapshot } from 'valtio';

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
