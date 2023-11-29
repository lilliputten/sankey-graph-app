export function cleanupList<T = unknown>(list?: T[]): T[] | undefined {
  list = Array.isArray(list) ? list.filter(Boolean) : undefined;
  return list && list.length ? list : undefined;
}

/** Array filter mapper to filter only unique values */
export function onlyUnique<T extends unknown>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}
