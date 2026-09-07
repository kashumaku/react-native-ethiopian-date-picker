/**
 * Determines whether a given Ethiopian calendar year is a leap year.
 * In the Ethiopian calendar, every year with `year % 4 === 3` is a leap year
 * (having 6 days in Pagumen instead of 5).
 *
 * @param year Ethiopian year
 * @returns boolean true if the Ethiopian year is a leap year
 */
export function isEthiopianLeapYear(year: number): boolean {
  if (!Number.isInteger(year)) {
    return false;
  }
  // Handles positive and negative years correctly using Euclidean remainder
  return ((year % 4) + 4) % 4 === 3;
}
