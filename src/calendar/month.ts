import type { EthiopianDate } from "../types";

/**
 * Calculates the next Ethiopian month and year.
 * When navigating forward from Pagumen (month 13), rolls over to Meskerem (month 1) of the next year.
 *
 * @param year Current Ethiopian year
 * @param month Current Ethiopian month (1 to 13)
 * @returns EthiopianDate at day 1 of the next month
 */
export function nextEthiopianMonth(year: number, month: number): EthiopianDate {
  if (month >= 13) {
    return {
      year: year + 1,
      month: 1,
      day: 1,
    };
  }
  return {
    year,
    month: month + 1,
    day: 1,
  };
}

/**
 * Calculates the previous Ethiopian month and year.
 * When navigating backward from Meskerem (month 1), rolls back to Pagumen (month 13) of the previous year.
 *
 * @param year Current Ethiopian year
 * @param month Current Ethiopian month (1 to 13)
 * @returns EthiopianDate at day 1 of the previous month
 */
export function previousEthiopianMonth(year: number, month: number): EthiopianDate {
  if (month <= 1) {
    return {
      year: year - 1,
      month: 13,
      day: 1,
    };
  }
  return {
    year,
    month: month - 1,
    day: 1,
  };
}
