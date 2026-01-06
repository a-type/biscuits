import { MeetupSelect } from '@/components/sync/meetup/MeetupSelect.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { ActionButton, Icon, SelectValue } from '@a-type/ui';

export interface MeetupActionProps {}

export function MeetupAction({}: MeetupActionProps) {
	const hasPeers = hooks.usePeerIds().length > 0;

	return (
		<MeetupSelect>
			{(location) => (
				<ActionButton
					size="small"
					color="accent"
					emphasis={!!location ? 'light' : 'default'}
					visible={hasPeers}
				>
					<Icon name="location" />
					<SelectValue>{(v) => v || 'Meet up'}</SelectValue>
				</ActionButton>
			)}
		</MeetupSelect>
	);
}
