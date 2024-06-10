import { hooks } from '@/store.js';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import { List } from '@trip-tick.biscuits/verdant';
import { TemperatureUnit } from '../weather/TemperatureUnit.jsx';
import { useCanSync } from '@biscuits/client';
import { useTemperatureUnit } from '../weather/useTemperatureUnit.js';
import { Input } from '@a-type/ui/components/input/Input';
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from '@a-type/ui/components/collapsible';
import { Icon } from '@a-type/ui/components/icon';

export interface ListInfoEditorProps {
  list: List;
}

export function ListInfoEditor({ list }: ListInfoEditorProps) {
  const isSubscribed = useCanSync();
  const { hotThreshold, coldThreshold } = hooks.useWatch(list);
  const { toDisplay, fromDisplay } = useTemperatureUnit();

  if (!isSubscribed) return null;

  return (
    <CollapsibleRoot>
      <CollapsibleTrigger asChild>
        <div className="row w-full">
          <Icon name="gear" />
          <span className="mr-auto">
            <span className="font-bold">Weather settings</span> |{' '}
            <Icon name="arrowUp" /> {toDisplay(hotThreshold ?? 299)}{' '}
            <Icon name="arrowDown" /> {toDisplay(coldThreshold ?? 277)}{' '}
            <TemperatureUnit />
          </span>
          <Icon
            name="chevron"
            className="[[data-state=open]_&]:rotate-180 transition-transform"
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="row py-4 justify-stretch w-full">
          <div className="flex-1">
            <label className="font-bold block mb-1">Hot days are</label>
            <div className="flex flex-row gap-1 items-center">
              <Input
                className="w-100px"
                type="number"
                value={toDisplay(hotThreshold ?? 299)}
                onChange={(ev) => {
                  if (isNaN(ev.currentTarget.valueAsNumber)) return;
                  list.set(
                    'hotThreshold',
                    fromDisplay(ev.currentTarget.valueAsNumber),
                  );
                }}
                maxLength={3}
                onFocus={(ev) => {
                  ev.currentTarget.select();
                }}
              />
              <span>
                <TemperatureUnit /> and above
              </span>
            </div>
          </div>
          <div className="flex-1">
            <label className="font-bold block mb-1">Cold days are</label>
            <div className="flex flex-row gap-1 items-center">
              <Input
                className="w-100px"
                type="number"
                value={toDisplay(coldThreshold ?? 277)}
                onChange={(ev) => {
                  if (isNaN(ev.currentTarget.valueAsNumber)) return;
                  list.set(
                    'coldThreshold',
                    fromDisplay(ev.currentTarget.valueAsNumber),
                  );
                }}
                maxLength={3}
                onFocus={(ev) => {
                  ev.currentTarget.select();
                }}
              />
              <span>
                <TemperatureUnit /> and below
              </span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}
