import { ComponentProps } from 'react';
import { useAddItem } from './AddProvider.jsx';
import { CollapsibleSimple } from '@a-type/ui/components/collapsible';

export function AddOptionsCollapsible(
	props: ComponentProps<typeof CollapsibleSimple>,
) {
	const { inputValue } = useAddItem();

	return <CollapsibleSimple {...props} open={inputValue.length > 0} />;
}
