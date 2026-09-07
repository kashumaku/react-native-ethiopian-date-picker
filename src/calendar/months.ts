import { ETHIOPIAN_MONTHS } from "./constants";
import { isEthiopianLeapYear } from "./leapYear";
import type { EthiopianLocale, EthiopianMonth } from "../types";

/**
 * Returns the number of days in the specified Ethiopian month for a given year.
 * Months 1 through 12 have 30 days.
 * Month 13 (Pagumen) has 5 days in a common year, or 6 days in an Ethiopian leap year.
 *
 * @param year Ethiopian year
 * @param month Ethiopian month (1 to 13)
 * @throws Error if month is not between 1 and 13 or year/month are non-integers.
 */
export function getDaysInEthiopianMonth(year: number, month: number): number {
  if (!Number.isInteger(year)) {
    throw new Error(`Invalid Ethiopian year: ${year}. Year must be an integer.`);
  }

  if (!Number.isInteger(month) || month < 1 || month > 13) {
    throw new Error(`Invalid Ethiopian month: ${month}. Month must be an integer between 1 and 13.`);
  }

  if (month === 13) {
    return isEthiopianLeapYear(year) ? 6 : 5;
  }

  return 30;
}

/**
 * Retrieves the EthiopianMonth metadata for a given month number (1-13).
 *
 * @param monthNumber Ethiopian month number (1-13)
 * @throws Error if month number is out of range.
 */
export function getEthiopianMonth(monthNumber: number): EthiopianMonth {
  if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 13) {
    throw new Error(
      `Invalid Ethiopian month: ${monthNumber}. Month must be an integer between 1 and 13.`,
    );
  }
  const month = ETHIOPIAN_MONTHS[monthNumber - 1];
  if (!month) {
    throw new Error(`Month not found for number: ${monthNumber}`);
  }
  return month;
}

/**
 * Returns the localized name of an Ethiopian month.
 *
 * @param monthNumber Ethiopian month number (1-13)
 * @param locale "en" or "am" (default: "en")
 */
export function getEthiopianMonthName(
  monthNumber: number,
  locale: EthiopianLocale = "en",
): string {
  const month = getEthiopianMonth(monthNumber);
  return locale === "am" ? month.nameAm : month.name;
}

/**
 * Returns all 13 Ethiopian months metadata.
 */
export function getAllEthiopianMonths(): readonly EthiopianMonth[] {
  return ETHIOPIAN_MONTHS;
}
