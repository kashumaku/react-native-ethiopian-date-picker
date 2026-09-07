import { getDaysInEthiopianMonth } from "./months";
import { toGregorian } from "../conversion/ethiopianToGregorian";

/**
 * Generates a 7-column calendar grid for a specific Ethiopian month and year.
 * Days are aligned according to the weekday of the 1st day of the month (0 = Sunday, 6 = Saturday).
 * Empty preceding positions in the first week are filled with `null`.
 *
 * @param year Ethiopian year
 * @param month Ethiopian month (1 to 13)
 * @returns Array of day numbers (or null for empty padding cells)
 */
export function getEthiopianMonthGrid(year: number, month: number): Array<number | null> {
  const totalDays = getDaysInEthiopianMonth(year, month);
  const firstDayGregorian = toGregorian({ year, month, day: 1 });
  const startWeekday = firstDayGregorian.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const grid: Array<number | null> = [];

  // Leading empty cells
  for (let i = 0; i < startWeekday; i++) {
    grid.push(null);
  }

  // Days in month
  for (let day = 1; day <= totalDays; day++) {
    grid.push(day);
  }

  return grid;
}
