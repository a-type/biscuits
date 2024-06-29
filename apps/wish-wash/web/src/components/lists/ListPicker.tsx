import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from '@a-type/ui/components/select';

export interface ListPickerProps {
  value: string;
  onChange: (value: string, isNew: boolean) => void;
}

export function ListPicker({
  value,
  onChange: providedOnChange,
}: ListPickerProps) {
  const lists = hooks.useAllLists();
  const client = hooks.useClient();

  const onChange = async (value: string) => {
    if (value === 'new') {
      const list = await client.lists.put({});
      providedOnChange(list.get('id'), true);
    } else {
      providedOnChange(value, false);
    }
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger />
      <SelectContent>
        {lists.map((list) => (
          <SelectItem value={list.get('id')} key={list.uid}>
            {list.get('name')}
          </SelectItem>
        ))}
        <SelectItem value="new">
          <Icon name="plus" /> New list
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
