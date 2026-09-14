/** Null-prototype lookup: URL values like `constructor` are not content IDs. */
export function byId<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.assign(Object.create(null), Object.fromEntries(items.map((item) => [item.id, item])))
}
