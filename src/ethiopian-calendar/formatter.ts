import {
  DAYS_AM,
  DAYS_EN,
  ETHIOPIAN_MONTHS_AM,
  ETHIOPIAN_MONTHS_EN,
} from "./constants.js"

import {
  ethiopianToGregorian,
  gregorianToEthiopian,
 type EthiopianDate,
} from "./calendar.js"

export type EthiopianLocale = "en" | "am"

export type EthiopianFormat =
  | "short"
  | "medium"
  | "long"

export function formatEthiopian(
  date: Date | EthiopianDate = new Date(),
  format: EthiopianFormat = "medium",
  locale: EthiopianLocale = "en",
): string {
  const ethiopian: EthiopianDate =
    date instanceof Date
      ? gregorianToEthiopian(date)
      : date

  const months =
    locale === "am"
      ? ETHIOPIAN_MONTHS_AM
      : ETHIOPIAN_MONTHS_EN

  const days =
    locale === "am"
      ? DAYS_AM
      : DAYS_EN

  const month = months[ethiopian.month - 1]

  if (format === "short") {
    return [
      String(ethiopian.day).padStart(2, "0"),
      String(ethiopian.month).padStart(2, "0"),
      ethiopian.year,
    ].join("/")
  }

  if (format === "medium") {
    return `${month} ${ethiopian.day}, ${ethiopian.year}`
  }

  const gregorian = ethiopianToGregorian(
    ethiopian.year,
    ethiopian.month,
    ethiopian.day,
  )

  return `${
    days[gregorian.getDay()]
  }, ${month} ${ethiopian.day}, ${
    ethiopian.year
  }`
}