import { clsx } from '@a-type/ui';

export interface PriceProps {
	value?: number | null;
	currency?: string | null;
	className?: string;
	period?: string;
}

export function Price({
	value,
	currency,
	period = 'month',
	className,
	...rest
}: PriceProps) {
	const currencySymbol =
		currencySymbols[currency?.toUpperCase() ?? 'USD'] ?? '$';
	return (
		<span className={clsx('text-nowrap font-bold', className)} {...rest}>
			{currencySymbol}
			{((value ?? 0) / 100).toFixed(2)} / {period}
		</span>
	);
}

const currencySymbols: Record<string, string> = {
	USD: '$',
	EUR: '€',
	GBP: '£',
	YEN: '¥',
	INR: '₹',
	AUD: 'A$',
	CAD: 'C$',
	CHF: 'CHF',
	SEK: 'kr',
	NZD: 'NZ$',
};
