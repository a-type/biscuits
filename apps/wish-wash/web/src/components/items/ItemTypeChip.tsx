import { hooks } from '@/hooks.js';
import { Chip } from '@a-type/ui/components/chip';
import { Item } from '@wish-wash.biscuits/verdant';
import { typeIcons, typeThemes } from './typeThemes.js';
import { Icon } from '@a-type/ui/components/icon';
import { clsx } from '@a-type/ui';

export interface ItemTypeChipProps {
  item: Item;
  className?: string;
}

export function ItemTypeChip({ item, className }: ItemTypeChipProps) {
  const { type } = hooks.useWatch(item);

  return (
    <Chip
      color="primary"
      className={clsx(`theme-${typeThemes[type]} inline-flex`, className)}
    >
      <Icon name={typeIcons[type]} />
      {type}
    </Chip>
  );
}
