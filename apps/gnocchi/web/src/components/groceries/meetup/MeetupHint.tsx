import { MeetupSelect } from '@/components/sync/meetup/MeetupSelect.jsx';
import { hooks } from '@/stores/groceries/index.js';

export function MeetupHint() {
	const peers = hooks.usePeerIds();

	if (peers.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-grow-1 flex-col items-center justify-center gap-3 p-4 text-center">
			<p className="max-w-300px text-sm italic color-gray-dark">
				Time to regroup? Pick a location to meet up.
			</p>
			<label
				htmlFor="meetupHintSelect"
				className="text-xs italic color-gray-dark"
			>
				Meet at:
			</label>
			<MeetupSelect id="meetupHintSelect" emptyLabel="Choose..." />
		</div>
	);
}
