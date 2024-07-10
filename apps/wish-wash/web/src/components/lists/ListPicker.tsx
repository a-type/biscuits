import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectGroup,
  SelectSeparator,
  SelectLabel,
} from '@a-type/ui/components/select';
import { assert } from '@a-type/utils';
import { useCanSync } from '@biscuits/client';
import { authorization } from '@wish-wash.biscuits/verdant';

export interface ListPickerProps {
  value: string;
  onChange: (value: string, isNew: boolean) => void;
}

export function ListPicker({
  value,
  onChange: providedOnChange,
}: ListPickerProps) {
  const client = hooks.useClient();

  const onChange = async (id: string) => {
    if (id === 'new-shared') {
      const list = await client.lists.put({});
      providedOnChange(list.get('id'), true);
    } else if (id === 'new-private') {
      const list = await client.lists.put(
        {},
        {
          access: authorization.private,
        },
      );
      providedOnChange(list.get('id'), true);
    } else {
      providedOnChange(id, false);
    }
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger />
      <SelectContent>
        <ListsPickerLIsts />
      </SelectContent>
    </Select>
  );
}

function ListsPickerLIsts() {
  const lists = hooks.useAllLists();

  // segment by access
  const privateLists = lists.filter((list) => list.isAuthorized);
  const publicLists = lists.filter((list) => !list.isAuthorized);

  const canSync = useCanSync();

  return (
    <>
      <SelectGroup title="Shared lists">
        {publicLists.length > 0 && <SelectLabel>Shared lists</SelectLabel>}
        {publicLists.map((list) => (
          <SelectItem value={list.get('id')} key={list.uid}>
            <Icon name="add_person" /> {list.get('name')}
          </SelectItem>
        ))}
        <SelectItem
          value="new-shared"
          disabled={!canSync}
          className="font-bold"
        >
          <Icon name="add_person" /> New shared list
        </SelectItem>
      </SelectGroup>
      <SelectGroup title="Private lists" className="bg-wash">
        {privateLists.length > 0 && <SelectLabel>Private lists</SelectLabel>}
        {privateLists.map((list) => (
          <SelectItem value={list.get('id')} key={list.uid}>
            <Icon name="lock" /> {list.get('name')}
          </SelectItem>
        ))}
        <SelectItem value="new-private" className="font-bold">
          <Icon name="lock" /> New private list
        </SelectItem>
      </SelectGroup>
    </>
  );
}
