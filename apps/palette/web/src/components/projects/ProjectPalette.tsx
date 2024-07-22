import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { Project } from '@palette.biscuits/verdant';
import { useColorSelection } from './hooks.js';
import { ScrollArea } from '@a-type/ui/components/scrollArea';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';

export interface ProjectPaletteProps {
  project: Project;
  className?: string;
}

export function ProjectPalette({ project, className }: ProjectPaletteProps) {
  const { colors } = hooks.useWatch(project);
  hooks.useWatch(colors, { deep: true });

  // sort by hue
  const sorted = colors.getSnapshot().sort((a, b) => {
    return (
      rgbToHue(a.value.r, a.value.g, a.value.b) -
      rgbToHue(b.value.r, b.value.g, b.value.b)
    );
  });

  const [selectedId, selectId] = useColorSelection();

  const deleteSelectedColor = () => {
    if (selectedId) {
      const val = colors.find((c) => c.get('id') === selectedId);
      if (val) {
        colors.removeAll(val);
        selectId(null);
      }
    }
  };

  return (
    <div className={clsx('flex flex-col items-stretch', className)}>
      <div className="row py-1">
        <Button
          color="ghostDestructive"
          size="small"
          onClick={deleteSelectedColor}
          disabled={!selectedId}
          className="mr-auto"
        >
          <Icon name="trash" />
          Delete color
        </Button>
      </div>
      {!sorted.length && (
        <span className="text-xs text-gray-5 italic m-auto">
          Click the image to select colors
        </span>
      )}
      <ScrollArea background="wash" className="[flex:1_0_0]">
        <div
          className={clsx(
            'grid grid-cols-4 gap-1 justify-start items-start content-start',
          )}
          onClick={() => {
            selectId(null);
          }}
        >
          {sorted.map((color, i) => (
            <button
              key={i}
              className={clsx(
                'rounded appearance-none p-0 [border-image:none] border-solid aspect-1',
                selectedId === color.id ? 'border-2 border-black' : 'border-0',
              )}
              onClick={(ev) => {
                selectId(color.id);
                ev.stopPropagation();
              }}
              style={{
                backgroundColor: `rgb(${color.value.r}, ${color.value.g}, ${color.value.b})`,
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function rgbToHue(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta === 0) {
    hue = 0;
  } else if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }
  hue *= 60;
  if (hue < 0) {
    hue += 360;
  }
  return hue;
}
