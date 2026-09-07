import { isEthiopianLeapYear } from "../../src/calendar/leapYear";

describe("isEthiopianLeapYear", () => {
  it("should return true for Ethiopian leap years (year % 4 === 3)", () => {
    const leapYears = [1999, 2003, 2007, 2011, 2015, 2019, 2023, 2027, 2031];
    for (const year of leapYears) {
      expect(isEthiopianLeapYear(year)).toBe(true);
    }
  });

  it("should return false for Ethiopian common years", () => {
    const commonYears = [2012, 2013, 2014, 2016, 2017, 2018, 2020, 2021, 2022];
    for (const year of commonYears) {
      expect(isEthiopianLeapYear(year)).toBe(false);
    }
  });

  it("should correctly handle leap year boundaries (year before, leap, year after)", () => {
    expect(isEthiopianLeapYear(2014)).toBe(false); // year before leap
    expect(isEthiopianLeapYear(2015)).toBe(true);  // leap year
    expect(isEthiopianLeapYear(2016)).toBe(false); // year after leap

    expect(isEthiopianLeapYear(2018)).toBe(false); // year before leap
    expect(isEthiopianLeapYear(2019)).toBe(true);  // leap year
    expect(isEthiopianLeapYear(2020)).toBe(false); // year after leap
  });

  it("should return false for invalid non-integer inputs", () => {
    expect(isEthiopianLeapYear(2015.5)).toBe(false);
    expect(isEthiopianLeapYear(NaN)).toBe(false);
  });
});
