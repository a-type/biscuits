import { Icon } from '@a-type/ui';

export interface PinIconProps {
	isPinned: boolean;
}

export function PinIcon({ isPinned }: PinIconProps) {
	if (isPinned) {
		return <Icon name="pinFilled" />;
	}

	return <Icon name="pin" />;
}
