import { decomposeOid } from '@verdant-web/common';
import { ChangeHandler } from '../changeHander.js';

export const handleChanges: ChangeHandler<{
  createdItemCount: number;
  purchasedItemCount: number;
}> = async (info, get, schedule) => {
  // looking at operations on "item" entities that match the criteria...
  // 1. "initialize" op type
  // 2. "set" on "purchasedAt" field
  let createdItemCount = 0;
  let purchasedItemCount = 0;
  for (const { data, oid } of info.operations) {
    const { collection, subId } = decomposeOid(oid);
    // only interested in top-level item changes
    if (collection !== 'items' || subId) continue;

    if (data.op === 'initialize') {
      createdItemCount++;
    } else if (data.op === 'set' && data.name === 'purchasedAt') {
      purchasedItemCount++;
    }
  }

  if (createdItemCount || purchasedItemCount) {
    console.log('list changes detected');
    const existing = get();
    if (existing) {
      schedule({
        createdItemCount: existing.createdItemCount + createdItemCount,
        purchasedItemCount: existing.purchasedItemCount + purchasedItemCount,
      });
    } else {
      schedule({
        createdItemCount,
        purchasedItemCount,
      });
    }
  }
};
