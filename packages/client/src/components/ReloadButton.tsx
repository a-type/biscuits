import { useLocalStorage } from '../hooks/useStorage.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';

export interface ReloadButtonProps extends ButtonProps {}

export function ReloadButton({ onClick, ...props }: ReloadButtonProps) {
  const [_, setLastErrorReload] = useLastErrorReload();

  const refresh = () => {
    setLastErrorReload(Date.now() + 500);
    window.location.reload();
  };

  return (
    <Button
      {...props}
      onClick={(ev) => {
        onClick?.(ev);
        refresh();
      }}
    >
      <Icon name="refresh" />
      <span>Refresh</span>
    </Button>
  );
}

function useLastErrorReload() {
  return useLocalStorage('lastErrorReload', 0);
}

export function useHadRecentError() {
  const [lastErrorReload] = useLocalStorage('lastErrorReload', 0);

  const hadRecentError =
    lastErrorReload < Date.now() &&
    lastErrorReload > Date.now() - 1000 * 60 * 60;

  return hadRecentError;
}
