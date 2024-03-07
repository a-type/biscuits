import { ConfirmedButton } from '@a-type/ui/components/button';
import { useCanSync } from '../index.js';

export function ResetToServer({
  clientDescriptor,
}: {
  clientDescriptor: { __dangerous__resetLocal: () => void };
}) {
  const canSync = useCanSync();

  if (!canSync) return null;

  return (
    <ConfirmedButton
      color="destructive"
      confirmText="This will reset your local data to the server's version."
      onConfirm={() => {
        clientDescriptor.__dangerous__resetLocal();
      }}
    >
      Reset local data
    </ConfirmedButton>
  );
}
