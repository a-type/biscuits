import { Button, ButtonProps } from '@a-type/ui/components/button';
import { useContext, useState } from 'react';
import { VerdantContext } from '../verdant.js';
import { Icon } from '@a-type/ui/components/icon';
import { useAppId } from './Context.js';
import { appsById } from '@biscuits/apps';
import * as backup from '@verdant-web/store/backup';

export interface ExportDataButtonProps extends Omit<ButtonProps, 'onError'> {
  onError: (error: Error) => void;
}

export function ExportDataButton({
  children,
  onError,
  ...props
}: ExportDataButtonProps) {
  const [loading, setLoading] = useState(false);
  const clientDesc = useContext(VerdantContext);
  const appId = useAppId();
  const app = appsById[appId];
  if (!clientDesc) return null;
  return (
    <Button
      onClick={async () => {
        setLoading(true);
        try {
          const backup = await import('@verdant-web/store/backup');
          const client = await clientDesc.open();
          const file = await backup.createClientBackup(client);
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${app.name}-backup-${new Date().toISOString()}.zip`;
          a.click();
        } catch (e) {
          console.error(e);
          onError(e as Error);
        } finally {
          setLoading(false);
        }
      }}
      loading={loading}
      {...props}
    >
      {children || (
        <>
          Export Data <Icon name="download" />
        </>
      )}
    </Button>
  );
}

export function ImportDataButton({
  children,
  onError,
  ...props
}: ExportDataButtonProps) {
  const [loading, setLoading] = useState(false);
  const clientDesc = useContext(VerdantContext);
  if (!clientDesc) return null;
  return (
    <Button asChild loading={loading} {...props}>
      <label>
        <input
          type="file"
          hidden
          accept=".zip"
          onChange={async (ev) => {
            setLoading(true);
            try {
              const client = await clientDesc.open();
              const file = ev.target.files?.[0];
              if (!file) {
                throw new Error('No file selected');
              }
              await backup.importClientBackup(client, file);
              window.location.reload();
            } catch (e) {
              console.error(e);
              onError(e as Error);
            } finally {
              setLoading(false);
            }
          }}
        ></input>
        {children || (
          <>
            Import Data <Icon name="upload" />
          </>
        )}
      </label>
    </Button>
  );
}
