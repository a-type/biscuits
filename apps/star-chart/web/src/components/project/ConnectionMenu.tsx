import { Connection } from '@star-chart.biscuits/verdant';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { hooks } from '@/store.js';
import { animated, to } from '@react-spring/web';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';

export interface ConnectionMenuProps {
  connection: Connection;
}

export function ConnectionMenu({ connection }: ConnectionMenuProps) {
  const { sourceTaskId, targetTaskId } = hooks.useWatch(connection);

  const canvas = useCanvas();

  const sourceCenter = canvas.getLiveCenter(sourceTaskId);
  const targetCenter = canvas.getLiveCenter(targetTaskId);

  const client = hooks.useClient();
  const deleteConnection = () => {
    client.connections.delete(connection.get('id'));
  };

  return (
    <animated.div
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
