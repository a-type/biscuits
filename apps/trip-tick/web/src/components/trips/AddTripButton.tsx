import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { useNavigate } from '@verdant-web/react-router';

export interface AddTripButtonProps {}

export function AddTripButton({}: AddTripButtonProps) {
  const client = hooks.useClient();
  const navigate = useNavigate();

  return (
    <Button
      color="primary"
      onClick={async () => {
        const trip = await client.trips.put({});
        navigate(`/trips/${trip.get('id')}`);
      }}
    >
      New trip
    </Button>
  );
}
