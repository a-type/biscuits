import { Box, Icon } from '@a-type/ui';

export interface PinIconProps {
	isPinned: boolean;
}

export function PinIcon({ isPinned }: PinIconProps) {
	if (isPinned) {
		return (
			<Box>
				<Icon name="pinFilled" />
			</Box>
		);
	}

	return (
		<Box>
			<Icon name="pin" />
		</Box>
	);
}
