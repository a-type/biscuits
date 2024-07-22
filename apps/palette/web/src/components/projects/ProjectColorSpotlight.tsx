import { Project } from '@palette.biscuits/verdant';
import { useColorSelection } from './hooks.js';
import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';

export interface ProjectColorSpotlightProps {
  project: Project;
  className?: string;
}

export function ProjectColorSpotlight({
  project,
  className,
}: ProjectColorSpotlightProps) {
  const [selectedId] = useColorSelection();
  const { colors } = hooks.useWatch(project);
  const matchingColor = colors.find((c) => c.get('id') === selectedId);
  hooks.useWatch(matchingColor || null);

  if (!matchingColor) {
    return (
      <div
        className={clsx(
          'flex flex-col p-2 items-center justify-center',
          className,
        )}
      >
        <span className="text-xs text-gray-5 italic">
          Select a color to see it here
        </span>
      </div>
    );
  }

  const value = matchingColor.get('value').getSnapshot();

  return (
    <div
      className={clsx('w-full h-full rounded-lg', className)}
      style={{
        backgroundColor: `rgb(${value.r}, ${value.g}, ${value.b})`,
      }}
    />
  );
}
