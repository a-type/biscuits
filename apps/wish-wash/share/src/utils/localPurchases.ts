import { useLocalStorage } from '@a-type/ui';

export function useLocalPurchase(itemId: string) {
	return useLocalStorage(`local-purchase-${itemId}`, false, false);
}
