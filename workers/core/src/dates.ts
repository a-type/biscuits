export function compare(from: string, to: string): number {
  return new Date(from).getTime() - new Date(to).getTime();
}
