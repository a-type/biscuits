import { hooks } from '@/store.js';
import { Cursor } from './Cursor.jsx';

export interface PresenceCursorsProps {}

export function PresenceCursors({}: PresenceCursorsProps) {
	const peers = hooks.usePeerIds();

	return (
		<>
			{peers.map((peerId) => (
				<Cursor userId={peerId} key={peerId} />
			))}
		</>
	);
}
