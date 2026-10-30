import type { EthiopianDate } from "../types";

/** Construct a local date without JavaScript's special handling of years 0–99. */
export function createGregorianDate(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return date;
}

/** Number of days in a Gregorian month (month is 1-based). */
export function getDaysInGregorianMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Invalid Gregorian year or month.");
  }
  return createGregorianDate(year, month + 1, 0).getDate();
}

/** 7-column grid aligned to Sunday for a Gregorian month. */
export function getGregorianMonthGrid(year: number, month: number): Array<number | null> {
  const offset = createGregorianDate(year, month, 1).getDay();
  const days = getDaysInGregorianMonth(year, month);
  return [
    ...Array<number | null>(offset).fill(null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ];
}

export function nextGregorianMonth(year: number, month: number): EthiopianDate {
  return month === 12
    ? { year: year + 1, month: 1, day: 1 }
    : { year, month: month + 1, day: 1 };
}

export function previousGregorianMonth(year: number, month: number): EthiopianDate {
  return month === 1
    ? { year: year - 1, month: 12, day: 1 }
    : { year, month: month - 1, day: 1 };
}

