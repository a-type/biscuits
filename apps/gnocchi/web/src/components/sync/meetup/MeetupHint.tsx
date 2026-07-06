import { hooks } from '@/stores/groceries/index.js';
import { Box } from '@a-type/ui';
import { MeetupIcon } from './MeetupIcon.jsx';

export interface MeetupHintProps {
	className?: string;
}

const now = Date.now();
export function MeetupHint({ className, ...props }: MeetupHintProps) {
	const info = hooks.useCollaborationInfo('default');
	hooks.useWatch(info);
	const meetup = info?.get('meetup');

	if (meetup && meetup.get('createdAt') > now - 1000 * 60 * 60) {
		return (
			<Box
				surface="secondary"
				color="attention"
				layout="center center"
				style={{ width: 17, height: 17 }}
				className={className}
				{...props}
			>
				<MeetupIcon />
			</Box>
		);
	}

	return null;
}
