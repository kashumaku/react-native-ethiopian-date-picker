import { ETHIOPIAN_WEEKDAYS } from "./constants";
import type { EthiopianLocale, EthiopianWeekday } from "../types";

/**
 * Returns metadata for a weekday index (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
 */
export function getEthiopianWeekday(dayNumber: number): EthiopianWeekday {
  if (!Number.isInteger(dayNumber) || dayNumber < 0 || dayNumber > 6) {
    throw new Error(
      `Invalid weekday index: ${dayNumber}. Weekday must be an integer between 0 and 6.`,
    );
  }
  const day = ETHIOPIAN_WEEKDAYS[dayNumber];
  if (!day) {
    throw new Error(`Weekday not found for index: ${dayNumber}`);
  }
  return day;
}

/**
 * Returns the localized name of a weekday.
 *
 * @param dayNumber Weekday index (0 = Sunday .. 6 = Saturday)
 * @param locale "en" or "am" (default: "en")
 * @param short Whether to return the abbreviated name (default: false)
 */
export function getEthiopianWeekdayName(
  dayNumber: number,
  locale: EthiopianLocale = "en",
  short: boolean = false,
): string {
  const weekday = getEthiopianWeekday(dayNumber);
  if (locale === "am") {
    return short ? weekday.shortNameAm : weekday.nameAm;
  }
  return short ? weekday.shortName : weekday.name;
}

/**
 * Returns all weekdays starting from Sunday.
 */
export function getAllEthiopianWeekdays(): readonly EthiopianWeekday[] {
  return ETHIOPIAN_WEEKDAYS;
}
