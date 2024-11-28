import { hooks } from '@/stores/groceries/index.js';
import classNames from 'classnames';
import { MeetupIcon } from './MeetupIcon.jsx';

export interface MeetupHintProps {
	className?: string;
}

export function MeetupHint({ className, ...props }: MeetupHintProps) {
	const info = hooks.useCollaborationInfo('default');
	hooks.useWatch(info);
	const meetup = info?.get('meetup');

	if (meetup && meetup.get('createdAt') > Date.now() - 1000 * 60 * 60) {
		return (
			<div
				className={classNames(
					'bg-attention p-2px rounded-full color-white w-17px h-17px flex items-center justify-center',
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
