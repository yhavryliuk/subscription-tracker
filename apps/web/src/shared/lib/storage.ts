export const getItem = <T = unknown>(
  key: string,
  isPersistent = false,
): T | undefined => {
  let value;

  try {
    value = isPersistent
      ? localStorage.getItem(key)
      : sessionStorage.getItem(key);

    if (value === null || value === "") {
      return undefined;
    }
    // eslint-disable-next-line consistent-return
    return JSON.parse(value) as T;
  } catch {
    // eslint-disable-next-line consistent-return
    return value as T;
  }
};

export const setItem = (
  key: string,
  value: unknown,
  isPersistent = false,
): void => {
  const stringifiedValue =
    typeof value === "string" ? value : JSON.stringify(value);
  isPersistent
    ? localStorage.setItem(key, stringifiedValue)
    : sessionStorage.setItem(key, stringifiedValue);
};

export const removeItem = (key: string, isPersistent = false): void => {
  isPersistent ? localStorage.removeItem(key) : sessionStorage.removeItem(key);
};

export const findItem = (key: string): unknown => {
  return getItem(key, true) ?? getItem(key);
};

export const popItem = (key: string, isPersistent = false): unknown => {
  const value = getItem(key, isPersistent);
  removeItem(key, isPersistent);
  return value;
};

export const storage = {
  getItem,
  popItem,
  removeItem,
  setItem,
};

export enum StorageKeys {
  IS_MOBILE_SIDEBAR_OPEN = "IS_MOBILE_SIDEBAR_OPEN",
  USER_SHORT_INFO = "USER_SHORT_INFO",
}
