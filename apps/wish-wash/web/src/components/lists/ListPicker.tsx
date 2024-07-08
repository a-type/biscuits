import { privateHooks } from '@/privateStore.js';
import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectGroup,
  SelectSeparator,
} from '@a-type/ui/components/select';
import { assert } from '@a-type/utils';

export interface ListPickerProps {
  value: string;
  valueVisibility: 'shared' | 'private';
  onChange: (
    value: string,
    isNew: boolean,
    visibility: 'shared' | 'private',
  ) => void;
}

export function ListPicker({
  value,
  valueVisibility,
  onChange: providedOnChange,
}: ListPickerProps) {
  const client = hooks.useClient();
  const privateClient = privateHooks.useClient();

  const onChange = async (value: string) => {
    if (value === 'new-shared') {
      const list = await client.lists.put({});
      providedOnChange(list.get('id'), true, 'shared');
    } else if (value === 'new-private') {
      const list = await privateClient.lists.put({});
      providedOnChange(list.get('id'), true, 'private');
    } else {
      const [visibility, id] = value.split('::');
      assert(visibility === 'shared' || visibility === 'private');
      providedOnChange(id, false, visibility);
    }
  };

  return (
    <Select value={`${valueVisibility}::${value}`} onValueChange={onChange}>
      <SelectTrigger />
      <SelectContent>
        <SharedLists />
        <PrivateLists />
      </SelectContent>
    </Select>
  );
}

function SharedLists() {
  const lists = hooks.useAllLists();

  return (
    <SelectGroup title="Shared lists" className="bg-wash">
      {lists.map((list) => (
        <SelectItem value={`shared::${list.get('id')}`} key={list.uid}>
          {list.get('name')}
        </SelectItem>
      ))}
      <SelectItem value="new-shared">
        <Icon name="add_person" /> New shared list
      </SelectItem>
    </SelectGroup>
  );
}

function PrivateLists() {
  const lists = privateHooks.useAllLists();

  return (
    <SelectGroup title="Private lists">
      {lists.map((list) => (
        <SelectItem value={`private::${list.get('id')}`} key={list.uid}>
          {list.get('name')}
        </SelectItem>
      ))}
      <SelectItem value="new-private">
        <Icon name="lock" /> New private list
      </SelectItem>
    </SelectGroup>
  );
}
