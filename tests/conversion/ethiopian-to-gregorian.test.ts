import { toGregorian } from "../../src/conversion/ethiopianToGregorian";

describe("toGregorian (Ethiopian -> Gregorian conversion)", () => {
  it("should convert Ethiopian Millennium correctly", () => {
    const date = toGregorian({ year: 2000, month: 1, day: 1 });
    expect(date.getFullYear()).toBe(2007);
    expect(date.getMonth()).toBe(8); // September (0-indexed)
    expect(date.getDate()).toBe(12);
  });

  it("should convert 1 Meskerem across different years", () => {
    const d2016 = toGregorian({ year: 2016, month: 1, day: 1 });
    expect(d2016.getFullYear()).toBe(2023);
    expect(d2016.getMonth()).toBe(8);
    expect(d2016.getDate()).toBe(12);

    const d2017 = toGregorian({ year: 2017, month: 1, day: 1 });
    expect(d2017.getFullYear()).toBe(2024);
    expect(d2017.getMonth()).toBe(8);
    expect(d2017.getDate()).toBe(11);
  });

  it("should convert leap Pagumen 6 correctly", () => {
    const date = toGregorian({ year: 2015, month: 13, day: 6 });
    expect(date.getFullYear()).toBe(2023);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(11);
  });

  it("should convert common Pagumen 5 correctly", () => {
    const date = toGregorian({ year: 2016, month: 13, day: 5 });
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(10);
  });

  it("should accept (year, month, day) overload", () => {
    const date = toGregorian(2016, 1, 1);
    expect(date.getFullYear()).toBe(2023);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(12);
  });

  it("should throw for invalid Ethiopian date", () => {
    expect(() => toGregorian({ year: 2018, month: 1, day: 31 })).toThrow();
    expect(() => toGregorian({ year: 2018, month: 13, day: 6 })).toThrow();
  });
});
