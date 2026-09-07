import { ETHIOPIAN_EPOCH } from "../calendar/constants";

/**
 * Converts a Gregorian date (year, month, day) into its corresponding Julian Day Number (JDN).
 * Uses the standard Fliegel-Van Flandern algorithm.
 *
 * @param year Gregorian year (e.g. 2026)
 * @param month Gregorian month (1 to 12)
 * @param day Gregorian day of month (1 to 31)
 * @returns Integer Julian Day Number
 */
export function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Converts a Julian Day Number (JDN) into its corresponding Gregorian calendar date.
 *
 * @param jdn Julian Day Number
 * @returns Object with year, month (1-12), and day (1-31)
 */
export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

/**
 * Converts an Ethiopian calendar date (year, month, day) into its corresponding Julian Day Number (JDN).
 *
 * @param year Ethiopian year (e.g. 2018)
 * @param month Ethiopian month (1 to 13)
 * @param day Ethiopian day (1 to 30, or 1 to 5/6 for Pagumen)
 * @returns Integer Julian Day Number
 */
export function ethiopianToJdn(year: number, month: number, day: number): number {
  return (
    ETHIOPIAN_EPOCH +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * (month - 1) +
    day -
    1
  );
}

/**
 * Converts a Julian Day Number (JDN) into its corresponding Ethiopian calendar date.
 *
 * @param jdn Julian Day Number
 * @returns Object with year, month (1-13), and day
 */
export function jdnToEthiopian(jdn: number): { year: number; month: number; day: number } {
  const days = jdn - ETHIOPIAN_EPOCH;
  const cycle = Math.floor(days / 1461);
  const rem = ((days % 1461) + 1461) % 1461;

  let yearInCycle: number;
  let dayInYear: number;

  if (rem < 365) {
    yearInCycle = 0;
    dayInYear = rem;
  } else if (rem < 730) {
    yearInCycle = 1;
    dayInYear = rem - 365;
  } else if (rem < 1096) {
    yearInCycle = 2;
    dayInYear = rem - 730;
  } else {
    yearInCycle = 3;
    dayInYear = rem - 1096;
  }

  const year = 4 * cycle + yearInCycle + 1;
  const month = Math.floor(dayInYear / 30) + 1;
  const day = (dayInYear % 30) + 1;

  return { year, month, day };
}
