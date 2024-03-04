export function getComputedQuantity({
  quantity,
  roundDown,
  days,
  perDays,
  additional,
}: {
  quantity: number;
  roundDown: boolean;
  days: number;
  perDays: number;
  additional: number;
}) {
  if (perDays < 1) {
    return additional + 1;
  }
  return (
    additional +
    (roundDown
      ? Math.floor((quantity * days) / perDays)
      : Math.ceil((quantity * days) / perDays))
  );
}
