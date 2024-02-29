export interface PriceProps {
  value?: number | null;
  currency?: string | null;
  className?: string;
}

export function Price({ value, currency, ...rest }: PriceProps) {
  return (
    <span {...rest}>
      {((value ?? 0) / 100).toFixed(2)} {currency} / month
    </span>
  );
}
