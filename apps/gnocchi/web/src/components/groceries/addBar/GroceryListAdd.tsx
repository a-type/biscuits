import {
	AddBarComboboxContent,
	AddBarComboboxInput,
	AddBarComboboxItems,
	AddBarComboboxRoot,
} from './combobox.jsx';

export interface GroceryListAddProps {
	className?: string;
}

export function GroceryListAdd(props: GroceryListAddProps) {
	return (
		<AddBarComboboxRoot>
			<AddBarComboboxInput {...props} />
			<AddBarComboboxContent className="<md:hidden">
				<AddBarComboboxItems />
			</AddBarComboboxContent>
		</AddBarComboboxRoot>
	);
}
