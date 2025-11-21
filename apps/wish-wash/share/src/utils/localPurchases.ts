import { useLocalStorage } from '@a-type/ui';

export function useLocalPurchase(itemId: string) {
	return useLocalStorage<string | null>(
		`local-purchase-${itemId}`,
		null,
		false,
	);
}
