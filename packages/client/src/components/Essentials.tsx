import { DeveloperErrorDialog } from './DeveloperErrorDialog.js';
import { LogoutNotice } from './LogoutNotice.js';
import { ResetNotifier } from './ResetNotifier.js';
import { SubscriptionExpiredDialog } from './SubscriptionExpiredDialog.js';
import { TosPrompt } from './TosPrompt.js';

export function Essentials() {
	return (
		<>
			<LogoutNotice />
			<TosPrompt />
			<SubscriptionExpiredDialog />
			<ResetNotifier />
			<DeveloperErrorDialog />
		</>
	);
}
