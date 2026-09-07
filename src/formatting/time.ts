import { gregorianToEthiopianTime, getTimePeriodName } from "../calendar/time";
import type {
  EthiopianTime,
  FormatEthiopianTimeOptions,
} from "../types";

/**
 * Formats a Gregorian Date or EthiopianTime object into a localized time string.
 *
 * @param time Date object or { hours, minutes }
 * @param options Formatting configuration (locale, 24h, Ethiopian convention, period inclusion)
 */
export function formatEthiopianTime(
  time: Date | EthiopianTime | null | undefined,
  options?: FormatEthiopianTimeOptions,
): string {
  if (!time) return "";

  const {
    locale = "en",
    is24Hour = false,
    useEthiopianConvention = false,
    includePeriod = true,
  } = options ?? {};

  let rawHours: number;
  let rawMinutes: number;

  if (time instanceof Date) {
    if (isNaN(time.getTime())) return "";
    rawHours = time.getHours();
    rawMinutes = time.getMinutes();
  } else {
    rawHours = time.hours;
    rawMinutes = time.minutes;
  }

  const padMinutes = String(rawMinutes).padStart(2, "0");

  if (useEthiopianConvention) {
    const { hours: ethH, period } = gregorianToEthiopianTime(rawHours, rawMinutes);
    const periodLabel = getTimePeriodName(period, locale);
    return includePeriod ? `${ethH}:${padMinutes} ${periodLabel}` : `${ethH}:${padMinutes}`;
  }

  if (is24Hour) {
    const padHours = String(rawHours).padStart(2, "0");
    return `${padHours}:${padMinutes}`;
  }

  // Standard 12-hour format
  const isPm = rawHours >= 12;
  const h12 = rawHours % 12 === 0 ? 12 : rawHours % 12;
  const amPmLabel = isPm
    ? locale === "am"
      ? "ከሰዓት"
      : "PM"
    : locale === "am"
    ? "ከጠዋት"
    : "AM";

  return includePeriod ? `${h12}:${padMinutes} ${amPmLabel}` : `${h12}:${padMinutes}`;
}
