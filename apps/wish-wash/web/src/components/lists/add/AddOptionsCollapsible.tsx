import { CollapsibleSimple } from '@a-type/ui';
import { ComponentProps } from 'react';
import { useAddItem } from './AddProvider.jsx';

export function AddOptionsCollapsible(
	props: ComponentProps<typeof CollapsibleSimple>,
) {
	const { inputValue } = useAddItem();

	return <CollapsibleSimple {...props} open={inputValue.length > 0} />;
}
