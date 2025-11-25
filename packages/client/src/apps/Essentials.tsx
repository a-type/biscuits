import { useEffect } from 'react';
import { LogoutNotice } from '../common/LogoutNotice.js';
import { SubscriptionExpiredDialog } from '../common/SubscriptionExpiredDialog.js';
import { TosPrompt } from '../common/TosPrompt.js';
import { DeveloperErrorDialog } from './DeveloperErrorDialog.js';
import { ResetNotifier } from './ResetNotifier.js';

export function Essentials() {
	useEffect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.setProperty('overscroll-behavior', 'none');
	}, []);
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
