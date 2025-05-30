import { Button, Icon } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { CanvasOverlayContent } from '../canvas/CanvasOverlay.jsx';

export interface HomeButtonProps {}

export function HomeButton({}: HomeButtonProps) {
	return (
		<CanvasOverlayContent className="absolute z-100 top-2 left-2">
			<Button asChild color="ghost">
				<Link to="/">
					<Icon name="arrowLeft" />
					Home
				</Link>
			</Button>
		</CanvasOverlayContent>
	);
}
