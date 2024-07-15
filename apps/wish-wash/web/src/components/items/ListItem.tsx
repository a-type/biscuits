import { Item } from '@wish-wash.biscuits/verdant';
import { Checkbox } from '@a-type/ui/components/checkbox';
import { hooks } from '@/store.js';
import { EditableText } from '@a-type/ui/components/editableText';
import { useSnapshot } from 'valtio';
import { createdItemState } from '../lists/state.js';
import {
  CardRoot,
  CardContent,
  CardMain,
  CardActions,
  CardFooter,
  CardTitle,
} from '@a-type/ui/components/card';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogClose,
} from '@a-type/ui/components/dialog';
import { Link } from '@verdant-web/react-router';
import { Button } from '@a-type/ui/components/button';
import { ReactNode, useState } from 'react';
import { Icon } from '@a-type/ui/components/icon';
import {
  FormikForm,
  SubmitButton,
  TextField,
} from '@a-type/ui/components/forms';
import { SearchButton } from './SearchButton.jsx';

export interface ListItemProps {
  item: Item;
}

export function ListItem({ item }: ListItemProps) {
  const { purchasedAt, description, link, id } = hooks.useWatch(item);
  const justCreatedId = useSnapshot(createdItemState).justCreatedId;

  const [addLinkOpen, setAddLinkOpen] = useState(false);

  return (
    <>
      <CardRoot>
        <CardMain className="col items-start" compact>
          <CardTitle>
            <EditableText
              value={description}
              onValueChange={(v) => item.set('description', v)}
              autoFocus={justCreatedId === id}
              autoSelect
            />
          </CardTitle>
          {link && <CardContent>(link)</CardContent>}
        </CardMain>
        <CardFooter className="items-center">
          {purchasedAt && (
            <span className="text-xxs italic text-gray-5 px-2">
              Purchased at {new Date(purchasedAt).toLocaleDateString()}
            </span>
          )}
          <div className="row ml-auto items-center">
            {link ? (
              <Button asChild color="accent">
                <Link to={link} newTab>
                  <Icon name="link" /> Visit
                </Link>
              </Button>
            ) : (
              <>
                <SearchButton item={item} />
                <Button onClick={() => setAddLinkOpen(true)}>
                  <Icon name="plus" /> Link
                </Button>
              </>
            )}
            <Button
              toggled={!!purchasedAt}
              color={purchasedAt ? 'default' : 'primary'}
              toggleMode="indicator"
              onClick={() => {
                if (purchasedAt) {
                  item.set('purchasedAt', null);
                } else {
                  item.set('purchasedAt', Date.now());
                }
              }}
            >
              {purchasedAt ? 'Bought' : 'Buy'}
            </Button>
          </div>
        </CardFooter>
      </CardRoot>
      <Dialog open={addLinkOpen} onOpenChange={setAddLinkOpen}>
        <FormikForm
          initialValues={{ link }}
          onSubmit={(values, form) => {
            item.set('link', values.link);
            form.resetForm();
            setAddLinkOpen(false);
          }}
        >
          <DialogContent>
            <DialogTitle>Add Link</DialogTitle>
            <TextField name="link" type="url" label="Link" required />
            <DialogActions>
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
              <SubmitButton color="primary">Add</SubmitButton>
            </DialogActions>
          </DialogContent>
        </FormikForm>
      </Dialog>
    </>
  );
}
