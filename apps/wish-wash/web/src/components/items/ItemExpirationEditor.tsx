import { hooks } from '@/hooks.js';
import { DatePicker } from '@a-type/ui/components/datePicker';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from '@a-type/ui/components/popover';
import { Button } from '@a-type/ui/components/button';
import { Item } from '@wish-wash.biscuits/verdant';
import { Icon } from '@a-type/ui/components/icon';
import { useState } from 'react';

export interface ItemExpirationEditorProps {
  item: Item;
}

export function ItemExpirationEditor({ item }: ItemExpirationEditorProps) {
  const expiresAtField = hooks.useField(item, 'expiresAt');
  const dateValue = expiresAtField.value
    ? new Date(expiresAtField.value)
    : null;

  const [open, setOpen] = useState(false);

  return (
    <div>
      <label>Reminder</label>
      <div className="row">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button color="ghost" className="flex-1">
              <Icon name="bell" />
              <span>{dateValue?.toDateString() ?? 'Add reminder'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-1000">
            <PopoverArrow />
            <DatePicker
              value={dateValue}
              onChange={(date) => {
                if (!date) {
                  expiresAtField.setValue(null);
                } else {
                  expiresAtField.setValue(date.getTime());
                }
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {!!dateValue && (
          <Button
            size="icon"
            color="ghost"
            onClick={() => expiresAtField.setValue(null)}
          >
            <Icon name="x" />
          </Button>
        )}
      </div>
    </div>
  );
}
