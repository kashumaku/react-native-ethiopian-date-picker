import { toEthiopian } from "../conversion/gregorianToEthiopian";
import { toGregorian } from "../conversion/ethiopianToGregorian";
import { getLocalization } from "../localization";
import type { EthiopianDate, FormatEthiopianDateOptions } from "../types";

/**
 * Formats an Ethiopian date or Gregorian Date into a localized string.
 *
 * @param date Gregorian Date or EthiopianDate
 * @param options Formatting options { locale, format, pattern }
 * @returns Formatted date string
 *
 * @example
 * formatEthiopianDate(new Date(2026, 8, 25)) // "15 Meskerem 2019"
 * formatEthiopianDate(new Date(2026, 8, 25), { locale: "am" }) // "15 መስከረም 2019"
 * formatEthiopianDate({ year: 2019, month: 1, day: 15 }, { format: "short" }) // "15/01/2019"
 */
export function formatEthiopianDate(
  date: Date | EthiopianDate,
  options?: FormatEthiopianDateOptions,
): string {
  const locale = options?.locale ?? "en";
  const dict = getLocalization(locale);

  let ethDate: EthiopianDate;
  let gregDate: Date;

  if (date instanceof Date) {
    gregDate = date;
    ethDate = toEthiopian(date);
  } else {
    ethDate = date;
    gregDate = toGregorian(date);
  }

  const { year, month, day } = ethDate;
  const monthIdx = month - 1;
  const weekdayIdx = gregDate.getDay();

  const monthName = dict.months[monthIdx] ?? "";
  const shortMonthName = dict.shortMonths[monthIdx] ?? "";
  const weekdayName = dict.weekdays[weekdayIdx] ?? "";
  const shortWeekdayName = dict.shortWeekdays[weekdayIdx] ?? "";

  if (options?.pattern) {
    return options.pattern
      .replace(/YYYY/g, String(year))
      .replace(/YY/g, String(year).slice(-2))
      .replace(/MMMM/g, monthName)
      .replace(/MMM/g, shortMonthName)
      .replace(/MM/g, String(month).padStart(2, "0"))
      .replace(/\bM\b/g, String(month))
      .replace(/DD/g, String(day).padStart(2, "0"))
      .replace(/\bD\b/g, String(day))
      .replace(/dddd/g, weekdayName)
      .replace(/ddd/g, shortWeekdayName);
  }

  const format = options?.format ?? "medium";

  switch (format) {
    case "short":
      return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    case "long":
      return `${monthName} ${day}, ${year}`;
    case "full":
      return `${weekdayName}, ${monthName} ${day}, ${year}`;
    case "medium":
    default:
      return `${day} ${monthName} ${year}`;
  }
}
