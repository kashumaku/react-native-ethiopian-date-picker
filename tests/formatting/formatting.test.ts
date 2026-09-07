import { formatEthiopianDate, formatEthiopianDateRange } from "../../src/formatting/format";

describe("formatEthiopianDate", () => {
  const sampleGregorian = new Date(2026, 8, 25); // September 25, 2026 -> 15 Meskerem 2019 (Friday)

  it("should format medium preset in English by default", () => {
    expect(formatEthiopianDate(sampleGregorian)).toBe("15 Meskerem 2019");
  });

  it("should format in Amharic when locale='am'", () => {
    expect(formatEthiopianDate(sampleGregorian, { locale: "am" })).toBe("15 መስከረም 2019");
  });

  it("should format short preset", () => {
    expect(formatEthiopianDate(sampleGregorian, { format: "short" })).toBe("15/01/2019");
  });

  it("should format long preset", () => {
    expect(formatEthiopianDate(sampleGregorian, { format: "long" })).toBe("Meskerem 15, 2019");
    expect(formatEthiopianDate(sampleGregorian, { format: "long", locale: "am" })).toBe(
      "መስከረም 15, 2019",
    );
  });

  it("should format full preset with weekday name", () => {
    expect(formatEthiopianDate(sampleGregorian, { format: "full" })).toBe(
      "Friday, Meskerem 15, 2019",
    );
    expect(formatEthiopianDate(sampleGregorian, { format: "full", locale: "am" })).toBe(
      "ዓርብ, መስከረም 15, 2019",
    );
  });

  it("should support custom pattern strings", () => {
    expect(formatEthiopianDate(sampleGregorian, { pattern: "YYYY-MM-DD" })).toBe("2019-01-15");
    expect(formatEthiopianDate(sampleGregorian, { pattern: "MMMM DD, YYYY (ddd)" })).toBe(
      "Meskerem 15, 2019 (Fri)",
    );
  });

  it("should format from an EthiopianDate object directly", () => {
    expect(formatEthiopianDate({ year: 2019, month: 1, day: 15 })).toBe("15 Meskerem 2019");
  });
});

describe("formatEthiopianDateRange", () => {
  const start = new Date(2026, 8, 25); // 15 Meskerem 2019
  const end = new Date(2026, 9, 2);    // 22 Meskerem 2019

  it("should format date range in English", () => {
    expect(formatEthiopianDateRange({ startDate: start, endDate: end })).toBe(
      "15 Meskerem 2019 – 22 Meskerem 2019",
    );
  });

  it("should format date range in Amharic", () => {
    expect(formatEthiopianDateRange({ startDate: start, endDate: end }, { locale: "am" })).toBe(
      "15 መስከረም 2019 – 22 መስከረም 2019",
    );
  });

  it("should format when only startDate is provided", () => {
    expect(formatEthiopianDateRange({ startDate: start, endDate: null })).toBe("15 Meskerem 2019");
  });

  it("should return empty string for empty range", () => {
    expect(formatEthiopianDateRange({ startDate: null, endDate: null })).toBe("");
  });
});
