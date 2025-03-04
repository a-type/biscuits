import { withClassName } from '@a-type/ui';
import * as TogglePrimitive from '@radix-ui/react-toggle-group';

export const ToggleGroup = withClassName(
	TogglePrimitive.Root,
	'inline-flex rounded space-x-px',
);

export const ToggleItem = withClassName(
	TogglePrimitive.Item,
	'flex items-stretch justify-center bg-gray-light p-4 border-none text-start cursor-pointer gap-2',
	'data-[state=on]:(bg-white ring-1 ring-gray-dark)',
	'first:rounded-l last:rounded-r',
	'focus:(z-10 outline-none)',
	'focus-visible:(ring-2 ring-primary ring-offset-2 ring-offset-gray-wash)',
);

export const ToggleItemIndicator = withClassName(
	'div',
	'self-start invisible color-primary-dark bg-primary-wash w-4 h-4 rounded',
	'[[data-state=on]>&]:(visible)',
);

export const ToggleItemLabel = withClassName(
	'div',
	'flex flex-col gap-2 items-start text-sm justify-center',
);

export const ToggleItemTitle = withClassName('span', 'font-bold color-black');

export const ToggleItemDescription = withClassName(
	'span',
	'color-gray-dark text-xs',
);
