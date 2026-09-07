import { formatEthiopianTime } from "../../src/formatting/time";

describe("formatEthiopianTime", () => {
  const morningDate = new Date(2026, 8, 25, 8, 15); // 8:15 AM -> 2:15 ጠዋት
  const afternoonDate = new Date(2026, 8, 25, 14, 45); // 2:45 PM / 14:45 -> 8:45 ከሰዓት

  it("should format standard 12-hour AM/PM", () => {
    expect(formatEthiopianTime(morningDate, { locale: "en" })).toBe("8:15 AM");
    expect(formatEthiopianTime(afternoonDate, { locale: "en" })).toBe("2:45 PM");
    expect(formatEthiopianTime(morningDate, { locale: "am" })).toBe("8:15 ከጠዋት");
    expect(formatEthiopianTime(afternoonDate, { locale: "am" })).toBe("2:45 ከሰዓት");
  });

  it("should format 24-hour format", () => {
    expect(formatEthiopianTime(morningDate, { is24Hour: true })).toBe("08:15");
    expect(formatEthiopianTime(afternoonDate, { is24Hour: true })).toBe("14:45");
  });

  it("should format Ethiopian solar convention", () => {
    expect(
      formatEthiopianTime(morningDate, {
        useEthiopianConvention: true,
        locale: "am",
      }),
    ).toBe("2:15 ጠዋት");

    expect(
      formatEthiopianTime(afternoonDate, {
        useEthiopianConvention: true,
        locale: "am",
      }),
    ).toBe("8:45 ከሰዓት");

    expect(
      formatEthiopianTime(morningDate, {
        useEthiopianConvention: true,
        locale: "en",
      }),
    ).toBe("2:15 Morning");
  });

  it("should accept { hours, minutes } object", () => {
    expect(formatEthiopianTime({ hours: 10, minutes: 5 }, { is24Hour: true })).toBe(
      "10:05",
    );
  });
});
