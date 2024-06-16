import { hooks } from '@/store.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import { useNavigate } from '@verdant-web/react-router';

export interface CreateSongButtonProps extends ButtonProps {}

export function CreateSongButton({
  onClick,
  children,
  ...rest
}: CreateSongButtonProps) {
  const client = hooks.useClient();
  const navigate = useNavigate();

  return (
    <Button
      onClick={async (ev) => {
        const song = await client.songs.put({
          title: 'Untitled Song',
        });
        onClick?.(ev);
        navigate(`/songs/${song.get('id')}`);
      }}
      {...rest}
    >
      {children || 'New Song'}
    </Button>
  );
}
