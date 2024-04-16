export function toCursor(value: string): string {
  return Buffer.from(value).toString('base64');
}

export function fromCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString('utf8');
}
