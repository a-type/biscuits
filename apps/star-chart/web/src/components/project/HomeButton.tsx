import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { Link } from '@verdant-web/react-router';

export interface HomeButtonProps {}

export function HomeButton({}: HomeButtonProps) {
  return (
    <Button asChild color="ghost" className="absolute z-100 top-2 left-2">
      <Link to="/">
        <Icon name="arrowLeft" />
        Home
      </Link>
    </Button>
  );
}
