import { usePurchasedText } from '@/components/pantry/hooks.js';
import { hooks } from '@/stores/groceries/index.js';
import { clsx, Icon, Text, Tooltip } from '@a-type/ui';
import cls from './RecentPurchaseHint.module.css';

export function RecentPurchaseHint({
	foodName,
	compact,
	className,
}: {
	foodName: string;
	compact?: boolean;
	className?: string;
}) {
	const food = hooks.useOneFood({
		index: { where: 'anyName', equals: foodName },
	});
	hooks.useWatch(food);

	const lastPurchasedAt = food?.get('lastPurchasedAt');
	const expiresAt = food?.get('expiresAt');
	const hasExpiration = !!food?.get('expiresAfterDays');
	const inInventory = food?.get('inInventory');

	const purchasedText = usePurchasedText(food, true);

	if (!food) {
		return null;
	}

	// no need to warn if the item was used; might as well rebuy if needed
	if (!inInventory) {
		return null;
	}

	const isExpired =
		// items without expirations are not expired
		!!expiresAt &&
		// items whose purchase date is within the expiration window are not expired
		// eslint-disable-next-line react-hooks/purity
		expiresAt < Date.now();

	// also show warning for non-perishable (no expiration) that were
	// bought in the last week
	const wasBoughtThisWeek =
		// eslint-disable-next-line react-hooks/purity
		lastPurchasedAt && lastPurchasedAt > Date.now() - 1000 * 60 * 60 * 24 * 7;

	// only show small version if the food isn't yet expired
	if (compact && (isExpired || (!hasExpiration && !wasBoughtThisWeek))) {
		return null;
	}

	if (compact) {
		return (
			<Tooltip content={purchasedText}>
				<Icon name="clock" className={clsx(cls.icon, className)} />
			</Tooltip>
		);
	}

	// only show the large version if it was purchased at all
	if (!lastPurchasedAt) return null;

	return (
		<Text
			emphasis="ambient"
			dim
			italic
			className={clsx('@mode-dense', cls.root, className)}
		>
			<Icon name="clock" style={{ marginRight: 4 }} />
			<Text>{purchasedText}</Text>
		</Text>
	);
}
