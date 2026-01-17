import { hooks } from '@/stores/groceries/index.js';
import classNames from 'classnames';
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
			<div
				className={classNames(
					'h-17px w-17px flex items-center justify-center rounded-full p-2px color-white bg-attention',
					className,
				)}
				{...props}
			>
				<MeetupIcon />
			</div>
		);
	}

	return null;
}
