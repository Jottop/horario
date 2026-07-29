export function makeId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
