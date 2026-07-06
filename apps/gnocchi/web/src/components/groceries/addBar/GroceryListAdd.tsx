import {
	AddBarComboboxContent,
	AddBarComboboxInput,
	AddBarComboboxItems,
	AddBarComboboxRoot,
} from './combobox.jsx';
import cls from './GroceryListAdd.module.css';

export interface GroceryListAddProps {
	className?: string;
}

export function GroceryListAdd(props: GroceryListAddProps) {
	return (
		<AddBarComboboxRoot>
			<AddBarComboboxInput {...props} />
			<AddBarComboboxContent className={cls.content}>
				<AddBarComboboxItems />
			</AddBarComboboxContent>
		</AddBarComboboxRoot>
	);
}
