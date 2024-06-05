import { Connection } from '@star-chart.biscuits/verdant';
import { hooks } from '@/store.js';
import { animated, to } from '@react-spring/web';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useCenter } from '../canvas/canvasHooks.js';
import { stopGesturePropagation } from '../canvas/events.js';
import { useCanvas } from '../canvas/CanvasProvider.jsx';

export interface ConnectionMenuProps {
  connection: Connection;
}

export function ConnectionMenu({ connection }: ConnectionMenuProps) {
  const { sourceTaskId, targetTaskId } = hooks.useWatch(connection);

  const sourceCenter = useCenter(sourceTaskId);
  const targetCenter = useCenter(targetTaskId);

  const client = hooks.useClient();
  const canvas = useCanvas();
  const deleteConnection = () => {
    client.connections.delete(connection.get('id'));
    canvas.selections.set([]);
  };

  return (
    <animated.div
      {...stopGesturePropagation}
      data-connection-menu
      style={{
        x: to([sourceCenter.x, targetCenter.x], (x1, x2) => (x1 + x2) / 2),
        y: to([sourceCenter.y, targetCenter.y], (y1, y2) => (y1 + y2) / 2),
      }}
      className="absolute z-10 bg-white shadow-md rounded-md p-2"
    >
      <Button size="small" onClick={deleteConnection} color="ghostDestructive">
        <Icon name="trash" />
        Delete
      </Button>
    </animated.div>
  );
}
