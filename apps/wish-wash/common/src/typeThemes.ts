import { IconName, ThemeName } from '@a-type/ui';

type ItemType = 'idea' | 'link' | 'vibe';

export const typeThemes: Record<ItemType, ThemeName> = {
	idea: 'lemon',
	link: 'leek',
	vibe: 'eggplant',
};

export const typeIcons: Record<ItemType, IconName> = {
	idea: 'lightbulb',
	link: 'gift',
	vibe: 'magic',
};

export const typeNames: Record<ItemType, string> = {
	idea: 'Idea',
	link: 'Link',
	vibe: 'Vibe',
};

export const typeDescriptions: Record<ItemType, string> = {
	idea: 'A suggestion for something to buy',
	link: 'A web link to a specific product',
	vibe: 'A general aesthetic or mood',
};
