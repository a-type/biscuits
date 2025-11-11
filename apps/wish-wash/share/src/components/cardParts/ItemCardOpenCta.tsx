import { Button, Card, Icon } from '@a-type/ui';

export function ItemCardOpenCta() {
	return (
		<Card.Content unstyled className="mt-auto">
			<Button color="primary" emphasis="light">
				Open
				<Icon name="new_window" />
			</Button>
		</Card.Content>
	);
}
