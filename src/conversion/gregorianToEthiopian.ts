import { gregorianToJdn, jdnToEthiopian } from "./julian";
import type { EthiopianDate } from "../types";

/**
 * Converts a Gregorian JavaScript Date into an EthiopianDate.
 *
 * Uses the local calendar components (year, month, date) of the provided Date object
 * to ensure that time-of-day and UTC offsets do not shift the calendar day.
 *
 * @param date Gregorian JavaScript Date (defaults to current date/time)
 * @returns EthiopianDate representation { year, month, day }
 */
export function toEthiopian(date: Date = new Date()): EthiopianDate {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid Gregorian Date provided to toEthiopian()");
  }

  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  const jdn = gregorianToJdn(gYear, gMonth, gDay);
  return jdnToEthiopian(jdn);
}
