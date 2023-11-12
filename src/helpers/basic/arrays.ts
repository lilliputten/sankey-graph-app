export function cleanupList<T = unknown>(list?: T[]): T[] | undefined {
  list = Array.isArray(list) ? list.filter(Boolean) : undefined;
  return list && list.length ? list : undefined;
}
