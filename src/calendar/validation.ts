import { isEthiopianLeapYear } from "./leapYear";
import type { EthiopianDate } from "../types";

/**
 * Checks whether an Ethiopian date object represents a valid calendar day.
 *
 * @param date EthiopianDate object with year, month, day
 * @returns boolean true if the date is valid, false otherwise
 */
export function isValidEthiopianDate(date: EthiopianDate): boolean {
  if (!date || typeof date !== "object") {
    return false;
  }

  const { year, month, day } = date;

  if (!Number.isInteger(year) || year < 1) {
    return false;
  }

  if (!Number.isInteger(month) || month < 1 || month > 13) {
    return false;
  }

  if (!Number.isInteger(day) || day < 1) {
    return false;
  }

  const maxDays = month === 13 ? (isEthiopianLeapYear(year) ? 6 : 5) : 30;

  return day <= maxDays;
}

/**
 * Validates an Ethiopian date and throws descriptive errors if invalid.
 *
 * @param date EthiopianDate object to validate
 * @throws Error if any field is invalid
 */
export function validateEthiopianDate(date: EthiopianDate): void {
  if (!date || typeof date !== "object") {
    throw new Error("Invalid Ethiopian date: provided value is not an object.");
  }

  const { year, month, day } = date;

  if (!Number.isInteger(year) || year < 1) {
    throw new Error(`Invalid Ethiopian year: ${year}. Year must be a positive integer.`);
  }

  if (!Number.isInteger(month) || month < 1 || month > 13) {
    throw new Error(`Invalid Ethiopian month: ${month}. Month must be an integer between 1 and 13.`);
  }

  if (!Number.isInteger(day) || day < 1) {
    throw new Error(`Invalid Ethiopian day: ${day}. Day must be a positive integer.`);
  }

  if (month === 13) {
    const isLeap = isEthiopianLeapYear(year);
    const maxDays = isLeap ? 6 : 5;
    if (day > maxDays) {
      throw new Error(
        `Invalid Pagumen day: ${day} for ${isLeap ? "leap" : "non-leap"} Ethiopian year ${year}. Pagumen has ${maxDays} days in ${year}.`,
      );
    }
  } else if (day > 30) {
    throw new Error(
      `Invalid Ethiopian day: ${day} for month ${month}. Months 1 to 12 have at most 30 days.`,
    );
  }
}
