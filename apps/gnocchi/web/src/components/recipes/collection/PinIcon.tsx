import { Box, Icon } from '@a-type/ui';
import cls from './PinIcon.module.css';

export interface PinIconProps {
	isPinned: boolean;
}

export function PinIcon({ isPinned }: PinIconProps) {
	if (isPinned) {
		return (
			<Box>
				<Icon name="pin" className={cls.first} />
				<Icon name="x" className={cls.second} />
			</Box>
		);
	}

	return (
		<Box>
			<Icon name="pinFilled" />
		</Box>
	);
}
