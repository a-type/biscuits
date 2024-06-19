import { hooks } from '@/store.js';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from '@a-type/ui/components/select';

export interface ListPickerProps {
  value: string;
  onChange: (value: string) => void;
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
      providedOnChange(list.get('id'));
    } else {
      providedOnChange(value);
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
        <SelectItem value="new">New list</SelectItem>
      </SelectContent>
    </Select>
  );
}
