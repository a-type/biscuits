import { MeetupSelect } from '@/components/sync/meetup/MeetupSelect.jsx';
import { hooks } from '@/stores/groceries/index.js';
import cls from './MeetupHint.module.css';

export function MeetupHint() {
	const peers = hooks.usePeerIds();

	if (peers.length === 0) {
		return null;
	}

	return (
		<div className={cls.root}>
			<p className={cls.text}>Time to regroup? Pick a location to meet up.</p>
			<label htmlFor="meetupHintSelect" className={cls.label}>
				Meet at:
			</label>
			<MeetupSelect id="meetupHintSelect" emptyLabel="Choose..." />
		</div>
	);
}
