import { ListItemsItemType } from '@wish-wash.biscuits/verdant';
import { ThemeName } from '@a-type/ui/components/colorPicker';
import { IconName } from '@a-type/ui/components/icon';

export const typeThemes: Record<ListItemsItemType, ThemeName> = {
  idea: 'lemon',
  product: 'leek',
  vibe: 'eggplant',
};

export const typeIcons: Record<ListItemsItemType, IconName> = {
  idea: 'lightbulb',
  product: 'gift',
  vibe: 'magic',
};
