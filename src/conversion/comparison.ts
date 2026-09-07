import type { EthiopianDate } from "../types";

/**
 * Checks whether two Gregorian dates represent the exact same calendar day (ignoring time components).
 */
export function isSameGregorianDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Checks whether calendar day `a` is strictly before calendar day `b`.
 */
export function isBeforeGregorianDay(a: Date, b: Date): boolean {
  const dateA = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const dateB = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return dateA < dateB;
}

/**
 * Checks whether calendar day `a` is strictly after calendar day `b`.
 */
export function isAfterGregorianDay(a: Date, b: Date): boolean {
  const dateA = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const dateB = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return dateA > dateB;
}

/**
 * Checks whether calendar day `a` is on or before calendar day `b`.
 */
export function isSameOrBeforeGregorianDay(a: Date, b: Date): boolean {
  return isSameGregorianDay(a, b) || isBeforeGregorianDay(a, b);
}

/**
 * Checks whether calendar day `a` is on or after calendar day `b`.
 */
export function isSameOrAfterGregorianDay(a: Date, b: Date): boolean {
  return isSameGregorianDay(a, b) || isAfterGregorianDay(a, b);
}

/**
 * Checks whether calendar day `date` is strictly between `start` and `end` (exclusive of endpoints).
 */
export function isBetweenGregorianDays(date: Date, start?: Date | null, end?: Date | null): boolean {
  if (!start || !end) return false;
  return isAfterGregorianDay(date, start) && isBeforeGregorianDay(date, end);
}

/**
 * Checks whether a Gregorian Date represents today's local calendar day.
 */
export function isToday(date: Date): boolean {
  return isSameGregorianDay(date, new Date());
}

/**
 * Checks whether two Ethiopian dates represent the same year, month, and day.
 */
export function isSameEthiopianDay(a?: EthiopianDate | null, b?: EthiopianDate | null): boolean {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day;
}
