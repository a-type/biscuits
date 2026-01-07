import { Icon } from '@a-type/ui';

export interface PinIconProps {
	isPinned: boolean;
}

export function PinIcon({ isPinned }: PinIconProps) {
	if (isPinned) {
		return (
			<div className="flex">
				<Icon name="pin" className="relative top--2px left-0px" />
				<Icon
					name="x"
					className="absolute w-10px h-10px bottom-5px right-8px"
				/>
			</div>
		);
	}

	return (
		<div className="flex">
			<Icon name="pinFilled" />
		</div>
	);
}
