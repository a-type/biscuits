import { LogoutNotice } from './LogoutNotice.js';
import { SubscriptionExpiredDialog } from './SubscriptionExpiredDialog.js';
import { TosPrompt } from './TosPrompt.js';

export function Essentials() {
  return (
    <>
      <LogoutNotice />
      <TosPrompt />
      <SubscriptionExpiredDialog />
    </>
  );
}
