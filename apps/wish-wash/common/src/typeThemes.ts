import { ThemeName } from '@a-type/ui/components/colorPicker';
import { IconName } from '@a-type/ui/components/icon';

type ItemType = 'idea' | 'product' | 'vibe';

export const typeThemes: Record<ItemType, ThemeName> = {
	idea: 'lemon',
	product: 'leek',
	vibe: 'eggplant',
};

export const typeIcons: Record<ItemType, IconName> = {
	idea: 'lightbulb',
	product: 'gift',
	vibe: 'magic',
};
