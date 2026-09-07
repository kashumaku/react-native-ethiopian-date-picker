import { validateEthiopianDate } from "../calendar/validation";
import { ethiopianToJdn, jdnToGregorian } from "./julian";
import type { EthiopianDate } from "../types";

/**
 * Converts an EthiopianDate into a Gregorian JavaScript Date.
 * The returned Date represents local midnight (00:00:00.000) on that calendar day.
 *
 * @param date EthiopianDate object or individual year, month, day numbers
 * @returns Standard JavaScript Date
 * @throws Error if the Ethiopian date is invalid
 */
export function toGregorian(
  dateOrYear: EthiopianDate | number,
  maybeMonth?: number,
  maybeDay?: number,
): Date {
  let ethDate: EthiopianDate;

  if (typeof dateOrYear === "number") {
    ethDate = {
      year: dateOrYear,
      month: maybeMonth ?? 1,
      day: maybeDay ?? 1,
    };
  } else {
    ethDate = dateOrYear;
  }

  validateEthiopianDate(ethDate);

  const jdn = ethiopianToJdn(ethDate.year, ethDate.month, ethDate.day);
  const { year, month, day } = jdnToGregorian(jdn);

  // Return local midnight for the determined Gregorian calendar day
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}
