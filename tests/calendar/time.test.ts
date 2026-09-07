import {
  gregorianToEthiopianTime,
  ethiopianToGregorianTime,
  getTimePeriodName,
} from "../../src/calendar/time";

describe("Ethiopian Time Calculations", () => {
  it("should convert Gregorian sunrise (6:00 AM) to Ethiopian 12:00 morning", () => {
    const result = gregorianToEthiopianTime(6, 0);
    expect(result.hours).toBe(12);
    expect(result.minutes).toBe(0);
    expect(result.period).toBe("morning");
  });

  it("should convert Gregorian 7:30 AM to Ethiopian 1:30 morning", () => {
    const result = gregorianToEthiopianTime(7, 30);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(30);
    expect(result.period).toBe("morning");
  });

  it("should convert Gregorian 12:00 PM (noon) to Ethiopian 6:00 afternoon", () => {
    const result = gregorianToEthiopianTime(12, 0);
    expect(result.hours).toBe(6);
    expect(result.period).toBe("afternoon");
  });

  it("should convert Gregorian 18:00 (6:00 PM) to Ethiopian 12:00 evening", () => {
    const result = gregorianToEthiopianTime(18, 0);
    expect(result.hours).toBe(12);
    expect(result.period).toBe("evening");
  });

  it("should convert Gregorian 00:00 (midnight) to Ethiopian 6:00 night", () => {
    const result = gregorianToEthiopianTime(0, 0);
    expect(result.hours).toBe(6);
    expect(result.period).toBe("night");
  });

  it("should roundtrip Ethiopian time back to Gregorian accurately", () => {
    // 3:15 Afternoon in Ethiopian time => 15:15 (3:15 PM) in Gregorian
    const greg = ethiopianToGregorianTime(3, 15, "afternoon");
    expect(greg.hours).toBe(15);
    expect(greg.minutes).toBe(15);

    // 12:00 Night in Ethiopian time => 06:00 (6:00 AM)
    const morningStart = ethiopianToGregorianTime(12, 0, "morning");
    expect(morningStart.hours).toBe(6);
    expect(morningStart.minutes).toBe(0);
  });

  it("should provide localized names for time periods", () => {
    expect(getTimePeriodName("morning", "en")).toBe("Morning");
    expect(getTimePeriodName("morning", "am")).toBe("ጠዋት");
    expect(getTimePeriodName("afternoon", "am")).toBe("ከሰዓት");
    expect(getTimePeriodName("evening", "am")).toBe("ማታ");
    expect(getTimePeriodName("night", "am")).toBe("ሌሊት");
  });
});
