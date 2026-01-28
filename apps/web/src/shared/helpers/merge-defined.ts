export function mergeDefined<T extends object>(target: T, source: Partial<T>) {
  for (const key in source) {
    const value = source[key];
    if (value !== undefined) {
      (target as any)[key] = value;
    }
  }
}
