import React from "react";
import ReactTestRenderer, { act } from "react-test-renderer";
import { EthiopianDatePicker } from "../../src/components/EthiopianDatePicker";
import { toEthiopian } from "../../src/conversion/gregorianToEthiopian";

describe("EthiopianDatePicker Component", () => {
  const sampleDate = new Date(2026, 8, 25); // September 25, 2026 -> 15 Meskerem 2019

  it("should render inline calendar with default or initial value", () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker value={sampleDate} testID="eth-picker" />,
      );
    });

    const root = tree.root;
    // Month/Year header button exists
    const toggleBtn = root.findByProps({ testID: "eth-picker-toggle-selector" });
    expect(toggleBtn).toBeTruthy();

    // Day 15 should be selected
    const day15 = root.findByProps({ testID: "eth-picker-day-15" });
    expect(day15).toBeTruthy();
    expect(day15.props.accessibilityState?.selected).toBe(true);
  });

  it("should support uncontrolled mode with defaultValue", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          defaultValue={sampleDate}
          onChange={handleChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    const day15 = root.findByProps({ testID: "eth-picker-day-15" });
    expect(day15).toBeTruthy();
    expect(day15.props.accessibilityState?.selected).toBe(true);
  });

  it("should select a day and trigger onChange in inline mode", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          value={sampleDate}
          onChange={handleChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    // Select day 20 Meskerem
    const day20 = root.findByProps({ testID: "eth-picker-day-20" });
    act(() => {
      day20.props.onPress();
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    const calledDate: Date = handleChange.mock.calls[0][0];
    const ethCalled = toEthiopian(calledDate);
    expect(ethCalled).toEqual({ year: 2019, month: 1, day: 20 });
  });

  it("should navigate to next month and previous month", () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker value={sampleDate} testID="eth-picker" />,
      );
    });

    const root = tree.root;
    const nextBtn = root.findByProps({ testID: "eth-picker-next-month" });
    act(() => {
      nextBtn.props.onPress();
    });

    // Should now show Tikimt header
    const toggleBtn = root.findByProps({ testID: "eth-picker-toggle-selector" });
    expect(toggleBtn.props.accessibilityLabel).toMatch(/Tikimt 2019/i);

    const prevBtn = root.findByProps({ testID: "eth-picker-prev-month" });
    act(() => {
      prevBtn.props.onPress();
    });

    expect(toggleBtn.props.accessibilityLabel).toMatch(/Meskerem 2019/i);
  });

  it("should navigate across year boundary (Meskerem prev -> Pagumen previous year)", () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker value={sampleDate} testID="eth-picker" />,
      );
    });

    const root = tree.root;
    const prevBtn = root.findByProps({ testID: "eth-picker-prev-month" });
    act(() => {
      prevBtn.props.onPress(); // Meskerem 2019 -> Pagumen 2018
    });

    const toggleBtn = root.findByProps({ testID: "eth-picker-toggle-selector" });
    expect(toggleBtn.props.accessibilityLabel).toMatch(/Pagumen 2018/i);
  });

  it("should render localized Amharic headers and day labels when locale='am'", () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker value={sampleDate} locale="am" testID="eth-picker" />,
      );
    });

    const root = tree.root;
    const toggleBtn = root.findByProps({ testID: "eth-picker-toggle-selector" });
    expect(toggleBtn.props.accessibilityLabel).toMatch(/መስከረም 2019/i);

    const day15 = root.findByProps({ testID: "eth-picker-day-15" });
    expect(day15.props.accessibilityLabel).toMatch(/15 መስከረም 2019/i);
  });

  it("should respect minimumDate and disable earlier dates", () => {
    const minDate = new Date(2026, 8, 20); // 10 Meskerem 2019
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          value={sampleDate}
          minimumDate={minDate}
          onChange={handleChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    // Day 5 Meskerem is before minDate (Day 10)
    const day5 = root.findByProps({ testID: "eth-picker-day-5" });
    expect(day5.props.accessibilityState?.disabled).toBe(true);

    act(() => {
      if (day5.props.onPress) {
        day5.props.onPress();
      }
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should respect maximumDate and disable later dates", () => {
    const maxDate = new Date(2026, 8, 26); // 16 Meskerem 2019
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          value={sampleDate}
          maximumDate={maxDate}
          onChange={handleChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    // Day 25 Meskerem is after maxDate (Day 16)
    const day25 = root.findByProps({ testID: "eth-picker-day-25" });
    expect(day25.props.accessibilityState?.disabled).toBe(true);

    act(() => {
      if (day25.props.onPress) {
        day25.props.onPress();
      }
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should support disabledDates predicate function", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          value={sampleDate}
          disabledDates={(date: Date) => date.getDay() === 0}
          onChange={handleChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    // September 27, 2026 is a Sunday (17 Meskerem 2019)
    const day17 = root.findByProps({ testID: "eth-picker-day-17" });
    expect(day17.props.accessibilityState?.disabled).toBe(true);

    act(() => {
      if (day17.props.onPress) {
        day17.props.onPress();
      }
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should support Today button shortcut", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          value={new Date(2020, 0, 1)}
          showTodayButton
          onChange={handleChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    const todayBtn = root.findByProps({ testID: "eth-picker-today-btn" });
    act(() => {
      todayBtn.props.onPress();
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    const todayCalled: Date = handleChange.mock.calls[0][0];
    const now = new Date();
    expect(todayCalled.getDate()).toBe(now.getDate());
    expect(todayCalled.getMonth()).toBe(now.getMonth());
    expect(todayCalled.getFullYear()).toBe(now.getFullYear());
  });

  it("should handle Month/Year selector toggle and month selection", () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker value={sampleDate} testID="eth-picker" />,
      );
    });

    const root = tree.root;
    // Open selector
    const toggleBtn = root.findByProps({ testID: "eth-picker-toggle-selector" });
    act(() => {
      toggleBtn.props.onPress();
    });

    // Select month 3 (Hidar)
    const hidarBtn = root.findByProps({ testID: "eth-picker-month-btn-3" });
    act(() => {
      hidarBtn.props.onPress();
    });

    // Header should now show Hidar
    const updatedToggleBtn = root.findByProps({ testID: "eth-picker-toggle-selector" });
    expect(updatedToggleBtn.props.accessibilityLabel).toMatch(/Hidar 2019/i);
  });

  it("should operate correctly in Modal mode with Cancel and Confirm", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          mode="modal"
          visible={true}
          value={sampleDate}
          onChange={handleChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    // Modal should be visible
    expect(root.findByProps({ testID: "eth-picker-modal" })).toBeTruthy();

    // Select Day 22 Meskerem (draft)
    const day22 = root.findByProps({ testID: "eth-picker-day-22" });
    act(() => {
      day22.props.onPress();
    });
    expect(handleChange).not.toHaveBeenCalled();

    // Confirm
    const confirmBtn = root.findByProps({ testID: "eth-picker-confirm-btn" });
    act(() => {
      confirmBtn.props.onPress();
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    const resultEth = toEthiopian(handleChange.mock.calls[0][0]);
    expect(resultEth).toEqual({ year: 2019, month: 1, day: 22 });
  });

  it("should discard draft selection on Modal Cancel", () => {
    const handleChange = jest.fn();
    const handleClose = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          mode="modal"
          visible={true}
          value={sampleDate}
          onChange={handleChange}
          onClose={handleClose}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    const day28 = root.findByProps({ testID: "eth-picker-day-28" });
    act(() => {
      day28.props.onPress();
    });

    const cancelBtn = root.findByProps({ testID: "eth-picker-cancel-btn" });
    act(() => {
      cancelBtn.props.onPress();
    });

    expect(handleChange).not.toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it("should disable entire picker when disabled prop is true", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          value={sampleDate}
          disabled={true}
          onChange={handleChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    const day10 = root.findByProps({ testID: "eth-picker-day-10" });
    expect(day10.props.accessibilityState?.disabled).toBe(true);
    act(() => {
      if (day10.props.onPress) {
        day10.props.onPress();
      }
    });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
