import { clsx } from '@a-type/ui';
import {
  ExportDataButton,
  ImportDataButton,
  VerdantContext,
  useCanSync,
} from '../index.js';
import { H2, P } from '@a-type/ui/components/typography';
import { useContext } from 'react';
import { ConfirmedButton } from '@a-type/ui/components/button';

export interface ManageStorageProps {
  className?: string;
  onError: (error: Error) => void;
}

export function ManageStorage({ className, onError }: ManageStorageProps) {
  const isSubscribed = useCanSync();
  const clientDesc = useContext(VerdantContext);

  // sync users cannot manage local storage, it would cause unexpected
  // results...
  if (isSubscribed) return null;

  return (
    <div className={clsx('flex flex-col items-start', className)}>
      <H2>Manage App Storage</H2>
      <P className="text-xs mb-2">
        This app stores all data on your device. You can export and import your
        data, or reset it.
      </P>
      <div className="flex flex-row gap-2 flex-wrap">
        <ExportDataButton onError={onError} />
        <ImportDataButton onError={onError} />
        <ConfirmedButton
          color="destructive"
          confirmText="This will delete your data. It cannot be undone."
          onConfirm={() => {
            clientDesc?.__dangerous__resetLocal();
          }}
        >
          Reset data
        </ConfirmedButton>
      </div>
    </div>
  );
}
