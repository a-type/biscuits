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
					color={!!location ? 'accent' : 'default'}
					visible={hasPeers}
				>
					<Icon name="location" />
					<SelectValue />
				</ActionButton>
			)}
		</MeetupSelect>
	);
}
