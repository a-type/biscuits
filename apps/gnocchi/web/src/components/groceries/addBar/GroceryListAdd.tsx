import {
	AddBarComboboxContent,
	AddBarComboboxInput,
	AddBarComboboxItems,
} from './combobox.jsx';

export interface GroceryListAddProps {
	className?: string;
}

export function GroceryListAdd(props: GroceryListAddProps) {
	return (
		<>
			<AddBarComboboxInput {...props} />
			<AddBarComboboxContent className="<md:hidden">
				<AddBarComboboxItems />
			</AddBarComboboxContent>
		</>
	);
}
