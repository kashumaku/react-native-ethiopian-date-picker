import { toEthiopian } from "../../src/conversion/gregorianToEthiopian";

describe("toEthiopian (Gregorian -> Ethiopian conversion)", () => {
  it("should convert Ethiopian Millennium correctly", () => {
    // September 12, 2007 -> 1 Meskerem 2000
    const eth = toEthiopian(new Date(2007, 8, 12));
    expect(eth).toEqual({ year: 2000, month: 1, day: 1 });
  });

  it("should convert Ethiopian New Year on common vs leap years", () => {
    // 2015 was leap year (Pagumen 2015 had 6 days), so 1 Meskerem 2016 fell on Sep 12, 2023
    expect(toEthiopian(new Date(2023, 8, 12))).toEqual({ year: 2016, month: 1, day: 1 });

    // 2016 was common year (Pagumen 2016 had 5 days), so 1 Meskerem 2017 fell on Sep 11, 2024
    expect(toEthiopian(new Date(2024, 8, 11))).toEqual({ year: 2017, month: 1, day: 1 });

    // 1 Meskerem 2018 -> Sep 11, 2025
    expect(toEthiopian(new Date(2025, 8, 11))).toEqual({ year: 2018, month: 1, day: 1 });

    // 1 Meskerem 2019 -> Sep 11, 2026
    expect(toEthiopian(new Date(2026, 8, 11))).toEqual({ year: 2019, month: 1, day: 1 });
  });

  it("should convert leap Pagumen 6 correctly", () => {
    // September 11, 2023 is 6 Pagumen 2015 (Leap Pagumen)
    expect(toEthiopian(new Date(2023, 8, 11))).toEqual({ year: 2015, month: 13, day: 6 });
  });

  it("should convert common Pagumen 5 correctly", () => {
    // September 10, 2024 is 5 Pagumen 2016
    expect(toEthiopian(new Date(2024, 8, 10))).toEqual({ year: 2016, month: 13, day: 5 });
  });

  it("should convert month boundaries across a full Ethiopian year (2016 EC)", () => {
    expect(toEthiopian(new Date(2023, 9, 11))).toEqual({ year: 2016, month: 1, day: 30 }); // 30 Meskerem
    expect(toEthiopian(new Date(2023, 10, 10))).toEqual({ year: 2016, month: 2, day: 30 }); // 30 Tikimt
    expect(toEthiopian(new Date(2023, 11, 10))).toEqual({ year: 2016, month: 3, day: 30 }); // 30 Hidar
    expect(toEthiopian(new Date(2024, 0, 9))).toEqual({ year: 2016, month: 4, day: 30 }); // 30 Tahsas
    expect(toEthiopian(new Date(2024, 1, 8))).toEqual({ year: 2016, month: 5, day: 30 }); // 30 Tir
    expect(toEthiopian(new Date(2024, 2, 9))).toEqual({ year: 2016, month: 6, day: 30 }); // 30 Yekatit
    expect(toEthiopian(new Date(2024, 3, 8))).toEqual({ year: 2016, month: 7, day: 30 }); // 30 Megabit
    expect(toEthiopian(new Date(2024, 4, 8))).toEqual({ year: 2016, month: 8, day: 30 }); // 30 Miazia
    expect(toEthiopian(new Date(2024, 5, 7))).toEqual({ year: 2016, month: 9, day: 30 }); // 30 Ginbot
    expect(toEthiopian(new Date(2024, 6, 7))).toEqual({ year: 2016, month: 10, day: 30 }); // 30 Sene
    expect(toEthiopian(new Date(2024, 7, 6))).toEqual({ year: 2016, month: 11, day: 30 }); // 30 Hamle
    expect(toEthiopian(new Date(2024, 8, 5))).toEqual({ year: 2016, month: 12, day: 30 }); // 30 Nehase
  });

  it("should convert Gregorian New Year boundary correctly", () => {
    // Dec 31, 2023 -> 21 Tahsas 2016
    expect(toEthiopian(new Date(2023, 11, 31))).toEqual({ year: 2016, month: 4, day: 21 });
    // Jan 1, 2024 -> 22 Tahsas 2016
    expect(toEthiopian(new Date(2024, 0, 1))).toEqual({ year: 2016, month: 4, day: 22 });
  });

  it("should handle leap year day in Gregorian calendar (Feb 29, 2024)", () => {
    // Feb 29, 2024 -> 21 Yekatit 2016
    expect(toEthiopian(new Date(2024, 1, 29))).toEqual({ year: 2016, month: 6, day: 21 });
  });
});
