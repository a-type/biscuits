import { ActionButton } from '@a-type/ui/components/actions';
import { useItemSize } from '../items/hooks.js';
import { Icon } from '@a-type/ui/components/icon';

export interface ItemSizeActionProps {
  className?: string;
}

export function ItemSizeAction({ className }: ItemSizeActionProps) {
  const [itemSize, setItemSize] = useItemSize();

  return (
    <ActionButton
      onClick={() => setItemSize(itemSize === 'small' ? 'large' : 'small')}
      className={className}
    >
      Card size:{' '}
      <Icon name={itemSize === 'small' ? 'cardsGrid' : 'cardsMixed'} />
    </ActionButton>
  );
}
