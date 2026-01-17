import { Icon } from '@a-type/ui';

export interface PinIconProps {
	isPinned: boolean;
}

export function PinIcon({ isPinned }: PinIconProps) {
	if (isPinned) {
		return (
			<div className="flex">
				<Icon name="pin" className="relative left-0px top--2px" />
				<Icon
					name="x"
					className="absolute bottom-5px right-8px h-10px w-10px"
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
