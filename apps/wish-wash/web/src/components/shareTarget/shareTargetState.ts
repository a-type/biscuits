import { onShare, ShareData } from '@biscuits/client';
import { proxy } from 'valtio';

export const shareTargetState = proxy({
  share: null as null | ShareData,
});

onShare((share) => {
  shareTargetState.share = share;
});
