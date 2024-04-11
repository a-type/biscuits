import { hooks } from '@/store.js';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import { List } from '@trip-tick.biscuits/verdant';
import { TemperatureUnit } from '../weather/TemperatureUnit.jsx';
import { useCanSync } from '@biscuits/client';
import { useTemperatureUnit } from '../weather/useTemperatureUnit.js';
import { Input } from '@a-type/ui/components/input/Input';

export interface ListInfoEditorProps {
  list: List;
}

export function ListInfoEditor({ list }: ListInfoEditorProps) {
  const isSubscribed = useCanSync();
  const { hotThreshold, coldThreshold } = hooks.useWatch(list);
  const { toDisplay, fromDisplay } = useTemperatureUnit();

  if (!isSubscribed) return null;

  return (
    <div className="flex flex-row gap-2">
      <div>
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
            + <TemperatureUnit />
          </span>
        </div>
      </div>
      <div>
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
            - <TemperatureUnit />
          </span>
        </div>
      </div>
    </div>
  );
}
