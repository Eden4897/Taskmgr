export function enumKeys(enumObj: Object) {
  return Object.keys(enumObj).filter(
    (value) => typeof value === 'string'
  ) as string[];
}
