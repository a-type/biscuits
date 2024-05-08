import { hooks } from '@/store.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import { useNavigate } from '@verdant-web/react-router';

export interface AddTripButtonProps extends ButtonProps {}

export function AddTripButton({
  children = 'New trip',
  ...props
}: AddTripButtonProps) {
  const client = hooks.useClient();
  const navigate = useNavigate();
  const lists = hooks.useAllLists();

  if (!lists.length) {
    // don't show this option yet - they need lists first
    return null;
  }

  return (
    <Button
      color="primary"
      onClick={async () => {
        const trip = await client.trips.put({});
        navigate(`/trips/${trip.get('id')}`);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
