import { toEthiopian } from "../../src/conversion/gregorianToEthiopian";
import { toGregorian } from "../../src/conversion/ethiopianToGregorian";
import { getDaysInEthiopianMonth } from "../../src/calendar/months";

describe("Round-Trip Conversion Property Tests", () => {
  it("should round-trip Gregorian -> Ethiopian -> Gregorian for all days in a 10-year span", () => {
    const startDate = new Date(2020, 0, 1);
    const totalDays = 365 * 10 + 3; // ~10 years including leap days

    for (let i = 0; i < totalDays; i++) {
      const current = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i,
      );

      const ethiopian = toEthiopian(current);
      const convertedBack = toGregorian(ethiopian);

      expect(convertedBack.getFullYear()).toBe(current.getFullYear());
      expect(convertedBack.getMonth()).toBe(current.getMonth());
      expect(convertedBack.getDate()).toBe(current.getDate());
    }
  });

  it("should round-trip Ethiopian -> Gregorian -> Ethiopian for every day across 100 Ethiopian years (1950 to 2050 EC)", () => {
    for (let year = 1950; year <= 2050; year++) {
      for (let month = 1; month <= 13; month++) {
        const daysInMonth = getDaysInEthiopianMonth(year, month);
        for (let day = 1; day <= daysInMonth; day++) {
          const original = { year, month, day };
          const gregorian = toGregorian(original);
          const convertedBack = toEthiopian(gregorian);

          expect(convertedBack.year).toBe(original.year);
          expect(convertedBack.month).toBe(original.month);
          expect(convertedBack.day).toBe(original.day);
        }
      }
    }
  });
});
