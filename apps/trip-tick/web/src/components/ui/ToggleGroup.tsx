import { withClassName } from '@a-type/ui';
import * as TogglePrimitive from '@radix-ui/react-toggle-group';
import cls from './ToggleGroup.module.css';

export const ToggleGroup = withClassName(TogglePrimitive.Root, cls.root);

export const ToggleItem = withClassName(TogglePrimitive.Item, cls.item);

export const ToggleItemIndicator = withClassName('div', cls.itemIndicator);

export const ToggleItemLabel = withClassName('div', cls.itemLabel);

export const ToggleItemTitle = withClassName('span', cls.itemTitle);

export const ToggleItemDescription = withClassName('span', cls.itemDescription);
