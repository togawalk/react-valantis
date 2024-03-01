export function getTimestamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}

export function removeDuplicates(arr: string[]): string[] {
    return Array.from(new Set(arr));
}
