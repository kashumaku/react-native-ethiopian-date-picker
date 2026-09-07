import { getDaysInEthiopianMonth } from "../../src/calendar/months";

describe("getDaysInEthiopianMonth", () => {
  it("should return 30 days for months 1 through 12 in any year", () => {
    const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020];
    for (const year of years) {
      for (let month = 1; month <= 12; month++) {
        expect(getDaysInEthiopianMonth(year, month)).toBe(30);
      }
    }
  });

  it("should return 5 days for Pagumen (month 13) in a common year", () => {
    const commonYears = [2014, 2016, 2017, 2018, 2020, 2021, 2022];
    for (const year of commonYears) {
      expect(getDaysInEthiopianMonth(year, 13)).toBe(5);
    }
  });

  it("should return 6 days for Pagumen (month 13) in an Ethiopian leap year", () => {
    const leapYears = [2003, 2007, 2011, 2015, 2019, 2023, 2027];
    for (const year of leapYears) {
      expect(getDaysInEthiopianMonth(year, 13)).toBe(6);
    }
  });

  it("should throw a useful error for invalid month numbers", () => {
    expect(() => getDaysInEthiopianMonth(2018, 0)).toThrow(/Invalid Ethiopian month/);
    expect(() => getDaysInEthiopianMonth(2018, 14)).toThrow(/Invalid Ethiopian month/);
    expect(() => getDaysInEthiopianMonth(2018, -1)).toThrow(/Invalid Ethiopian month/);
    expect(() => getDaysInEthiopianMonth(2018, 1.5)).toThrow(/Invalid Ethiopian month/);
  });

  it("should throw a useful error for invalid year numbers", () => {
    expect(() => getDaysInEthiopianMonth(NaN, 1)).toThrow(/Invalid Ethiopian year/);
    expect(() => getDaysInEthiopianMonth(2018.4, 1)).toThrow(/Invalid Ethiopian year/);
  });
});
