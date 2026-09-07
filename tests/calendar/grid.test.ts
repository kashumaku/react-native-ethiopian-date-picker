import { getEthiopianMonthGrid } from "../../src/calendar/calendarGrid";

describe("getEthiopianMonthGrid", () => {
  it("should generate correct grid starting weekday for Meskerem 2016 EC", () => {
    // 1 Meskerem 2016 is Sep 12, 2023 (Tuesday -> index 2)
    const grid = getEthiopianMonthGrid(2016, 1);
    expect(grid[0]).toBeNull();
    expect(grid[1]).toBeNull();
    expect(grid[2]).toBe(1);
    expect(grid[3]).toBe(2);
    expect(grid[31]).toBe(30);
    expect(grid.length).toBe(32);
  });

  it("should generate correct grid for leap Pagumen 2015 EC (6 days)", () => {
    // 1 Pagumen 2015 is Sep 6, 2023 (Wednesday -> index 3)
    const grid = getEthiopianMonthGrid(2015, 13);
    expect(grid[0]).toBeNull();
    expect(grid[1]).toBeNull();
    expect(grid[2]).toBeNull();
    expect(grid[3]).toBe(1);
    expect(grid[8]).toBe(6);
    expect(grid.length).toBe(9);
  });

  it("should generate correct grid for common Pagumen 2016 EC (5 days)", () => {
    // 1 Pagumen 2016 is Sep 6, 2024 (Friday -> index 5)
    const grid = getEthiopianMonthGrid(2016, 13);
    expect(grid[0]).toBeNull();
    expect(grid[1]).toBeNull();
    expect(grid[2]).toBeNull();
    expect(grid[3]).toBeNull();
    expect(grid[4]).toBeNull();
    expect(grid[5]).toBe(1);
    expect(grid[9]).toBe(5);
    expect(grid.length).toBe(10);
  });
});
