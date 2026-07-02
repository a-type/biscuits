import { Button, Card, Icon } from '@a-type/ui';

export function ItemCardOpenCta() {
	return (
		<Card.Content unstyled style={{ marginTop: 'auto' }}>
			<Button emphasis="light" render={<div />}>
				Open
				<Icon name="new_window" />
			</Button>
		</Card.Content>
	);
}
