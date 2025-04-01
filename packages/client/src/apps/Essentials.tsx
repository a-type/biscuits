import { LogoutNotice } from '../common/LogoutNotice.js';
import { SubscriptionExpiredDialog } from '../common/SubscriptionExpiredDialog.js';
import { TosPrompt } from '../common/TosPrompt.js';
import { DeveloperErrorDialog } from './DeveloperErrorDialog.js';
import { PwaInstaller } from './PwaInstaller.js';
import { ResetNotifier } from './ResetNotifier.js';

export function Essentials() {
	return (
		<>
			<LogoutNotice />
			<TosPrompt />
			<SubscriptionExpiredDialog />
			<ResetNotifier />
			<DeveloperErrorDialog />
			<PwaInstaller />
		</>
	);
}
