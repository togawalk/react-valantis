export function trimAndLimitArray(arr: string[], skip: number, max: number): string[] {
  const trimmedArray = arr.slice(skip, skip + max);
  return trimmedArray;
}
