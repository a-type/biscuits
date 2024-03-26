export interface PriceProps {
  value?: number | null;
  currency?: string | null;
  className?: string;
}

export function Price({ value, currency, ...rest }: PriceProps) {
  const currencySymbol =
    currencySymbols[currency?.toUpperCase() ?? 'USD'] ?? '$';
  return (
    <span {...rest}>
      {currencySymbol}
      {((value ?? 0) / 100).toFixed(2)} / month
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
