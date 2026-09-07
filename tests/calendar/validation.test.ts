import {
  isValidEthiopianDate,
  validateEthiopianDate,
} from "../../src/calendar/validation";

describe("validation", () => {
  describe("isValidEthiopianDate", () => {
    it("should return true for valid dates in months 1 to 12", () => {
      expect(isValidEthiopianDate({ year: 2018, month: 1, day: 1 })).toBe(true);
      expect(isValidEthiopianDate({ year: 2018, month: 1, day: 30 })).toBe(true);
      expect(isValidEthiopianDate({ year: 2018, month: 6, day: 15 })).toBe(true);
      expect(isValidEthiopianDate({ year: 2018, month: 12, day: 30 })).toBe(true);
    });

    it("should return false for day > 30 in months 1 to 12", () => {
      expect(isValidEthiopianDate({ year: 2018, month: 1, day: 31 })).toBe(false);
      expect(isValidEthiopianDate({ year: 2018, month: 12, day: 31 })).toBe(false);
    });

    it("should return true for 5 Pagumen in common year", () => {
      expect(isValidEthiopianDate({ year: 2018, month: 13, day: 5 })).toBe(true);
    });

    it("should return false for 6 Pagumen in common year", () => {
      expect(isValidEthiopianDate({ year: 2018, month: 13, day: 6 })).toBe(false);
    });

    it("should return true for 6 Pagumen in Ethiopian leap year", () => {
      expect(isValidEthiopianDate({ year: 2015, month: 13, day: 6 })).toBe(true);
      expect(isValidEthiopianDate({ year: 2019, month: 13, day: 6 })).toBe(true);
    });

    it("should return false for 7 Pagumen in Ethiopian leap year", () => {
      expect(isValidEthiopianDate({ year: 2019, month: 13, day: 7 })).toBe(false);
    });

    it("should return false for invalid month numbers or day <= 0", () => {
      expect(isValidEthiopianDate({ year: 2018, month: 0, day: 1 })).toBe(false);
      expect(isValidEthiopianDate({ year: 2018, month: 14, day: 1 })).toBe(false);
      expect(isValidEthiopianDate({ year: 2018, month: 1, day: 0 })).toBe(false);
      expect(isValidEthiopianDate({ year: 2018, month: 1, day: -5 })).toBe(false);
      expect(isValidEthiopianDate({ year: -2018, month: 1, day: 1 })).toBe(false);
    });
  });

  describe("validateEthiopianDate", () => {
    it("should not throw for valid dates", () => {
      expect(() =>
        validateEthiopianDate({ year: 2018, month: 1, day: 30 }),
      ).not.toThrow();
      expect(() =>
        validateEthiopianDate({ year: 2019, month: 13, day: 6 }),
      ).not.toThrow();
    });

    it("should throw useful descriptive errors for invalid dates", () => {
      expect(() =>
        validateEthiopianDate({ year: 2018, month: 1, day: 31 }),
      ).toThrow(/Invalid Ethiopian day: 31 for month 1/);

      expect(() =>
        validateEthiopianDate({ year: 2018, month: 13, day: 6 }),
      ).toThrow(/Invalid Pagumen day: 6 for non-leap Ethiopian year 2018/);

      expect(() =>
        validateEthiopianDate({ year: 2018, month: 14, day: 1 }),
      ).toThrow(/Invalid Ethiopian month: 14/);
    });
  });
});
