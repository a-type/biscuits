import { hooks } from '@/store.js';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import { List } from '@trip-tick.biscuits/verdant';
import { TemperatureUnit } from '../weather/TemperatureUnit.jsx';
import { useCanSync } from '@biscuits/client';

export interface ListInfoEditorProps {
  list: List;
}

export function ListInfoEditor({ list }: ListInfoEditorProps) {
  const isSubscribed = useCanSync();
  const { hotThreshold, coldThreshold } = hooks.useWatch(list);

  if (!isSubscribed) return null;

  return (
    <div className="flex flex-row gap-2">
      <div>
        <label className="font-bold block mb-1">Hot days are</label>
        <NumberStepper
          value={hotThreshold ?? 80}
          onChange={(v) => list.set('hotThreshold', v)}
          renderValue={(v) => (
            <span>
              {v}+ <TemperatureUnit unit="Fahrenheit" />
            </span>
          )}
        />
      </div>
      <div>
        <label className="font-bold block mb-1">Cold days are</label>
        <NumberStepper
          value={coldThreshold ?? 40}
          onChange={(v) => list.set('coldThreshold', v)}
          renderValue={(v) => (
            <span>
              {v}- <TemperatureUnit unit="Fahrenheit" />
            </span>
          )}
        />
      </div>
    </div>
  );
}
