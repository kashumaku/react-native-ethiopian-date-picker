import React from "react";
import ReactTestRenderer, { act } from "react-test-renderer";
import { EthiopianDatePicker } from "../../src/components/EthiopianDatePicker";
import { toEthiopian } from "../../src/conversion/gregorianToEthiopian";

describe("EthiopianDatePicker Range Picker Mode", () => {
  const sampleStart = new Date(2026, 8, 20); // 10 Meskerem 2019
  const sampleEnd = new Date(2026, 8, 25);   // 15 Meskerem 2019

  it("should render with selectionType='range' and preselected range", () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          selectionType="range"
          selectedRange={{ startDate: sampleStart, endDate: sampleEnd }}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    const day10 = root.findByProps({ testID: "eth-picker-day-10" });
    const day12 = root.findByProps({ testID: "eth-picker-day-12" });
    const day15 = root.findByProps({ testID: "eth-picker-day-15" });

    expect(day10).toBeTruthy();
    expect(day12).toBeTruthy();
    expect(day15).toBeTruthy();
    expect(day10.props.accessibilityState?.selected).toBe(true);
    expect(day15.props.accessibilityState?.selected).toBe(true);
  });

  it("should select start date on first click and end date on second click", () => {
    const handleRangeChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          selectionType="range"
          defaultValue={new Date(2026, 8, 25)}
          onRangeChange={handleRangeChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;

    // First click: Day 10 Meskerem
    const day10 = root.findByProps({ testID: "eth-picker-day-10" });
    act(() => {
      day10.props.onPress();
    });

    expect(handleRangeChange).toHaveBeenCalledTimes(1);
    const firstCall = handleRangeChange.mock.calls[0][0];
    expect(toEthiopian(firstCall.startDate)).toEqual({ year: 2019, month: 1, day: 10 });
    expect(firstCall.endDate).toBeNull();

    // Second click: Day 18 Meskerem
    const day18 = root.findByProps({ testID: "eth-picker-day-18" });
    act(() => {
      day18.props.onPress();
    });

    expect(handleRangeChange).toHaveBeenCalledTimes(2);
    const secondCall = handleRangeChange.mock.calls[1][0];
    expect(toEthiopian(secondCall.startDate)).toEqual({ year: 2019, month: 1, day: 10 });
    expect(toEthiopian(secondCall.endDate)).toEqual({ year: 2019, month: 1, day: 18 });
  });

  it("should reset start date if second click is before first click", () => {
    const handleRangeChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          selectionType="range"
          defaultValue={new Date(2026, 8, 25)}
          onRangeChange={handleRangeChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;

    // Click Day 15
    const day15 = root.findByProps({ testID: "eth-picker-day-15" });
    act(() => {
      day15.props.onPress();
    });

    // Click Day 10 (before 15) -> Should become new start date with endDate = null
    const day10 = root.findByProps({ testID: "eth-picker-day-10" });
    act(() => {
      day10.props.onPress();
    });

    const secondCall = handleRangeChange.mock.calls[1][0];
    expect(toEthiopian(secondCall.startDate)).toEqual({ year: 2019, month: 1, day: 10 });
    expect(secondCall.endDate).toBeNull();
  });

  it("should start a new range selection on click after range was already completed", () => {
    const handleRangeChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          selectionType="range"
          defaultSelectedRange={{ startDate: sampleStart, endDate: sampleEnd }}
          onRangeChange={handleRangeChange}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;

    // Click Day 20 Meskerem
    const day20 = root.findByProps({ testID: "eth-picker-day-20" });
    act(() => {
      day20.props.onPress();
    });

    expect(handleRangeChange).toHaveBeenCalledTimes(1);
    const call = handleRangeChange.mock.calls[0][0];
    expect(toEthiopian(call.startDate)).toEqual({ year: 2019, month: 1, day: 20 });
    expect(call.endDate).toBeNull();
  });

  it("should support Modal mode with Range selection, Confirm and Cancel", () => {
    const handleRangeChange = jest.fn();
    const handleClose = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          mode="modal"
          visible={true}
          selectionType="range"
          defaultSelectedRange={{ startDate: sampleStart, endDate: sampleEnd }}
          onRangeChange={handleRangeChange}
          onClose={handleClose}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;
    expect(root.findByProps({ testID: "eth-picker-modal" })).toBeTruthy();

    // Select new start day 2 Meskerem
    const day2 = root.findByProps({ testID: "eth-picker-day-2" });
    act(() => {
      day2.props.onPress();
    });
    // Select new end day 8 Meskerem
    const day8 = root.findByProps({ testID: "eth-picker-day-8" });
    act(() => {
      day8.props.onPress();
    });

    // In modal mode, onRangeChange should not fire until Confirm is clicked
    expect(handleRangeChange).not.toHaveBeenCalled();

    // Confirm
    const confirmBtn = root.findByProps({ testID: "eth-picker-confirm-btn" });
    act(() => {
      confirmBtn.props.onPress();
    });

    expect(handleRangeChange).toHaveBeenCalledTimes(1);
    const confirmed = handleRangeChange.mock.calls[0][0];
    expect(toEthiopian(confirmed.startDate)).toEqual({ year: 2019, month: 1, day: 2 });
    expect(toEthiopian(confirmed.endDate)).toEqual({ year: 2019, month: 1, day: 8 });
  });

  it("should discard draft range on Modal Cancel", () => {
    const handleRangeChange = jest.fn();
    const handleClose = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          mode="modal"
          visible={true}
          selectionType="range"
          defaultSelectedRange={{ startDate: sampleStart, endDate: sampleEnd }}
          onRangeChange={handleRangeChange}
          onClose={handleClose}
          testID="eth-picker"
        />,
      );
    });

    const root = tree.root;

    // Select Day 22
    const day22 = root.findByProps({ testID: "eth-picker-day-22" });
    act(() => {
      day22.props.onPress();
    });

    // Cancel
    const cancelBtn = root.findByProps({ testID: "eth-picker-cancel-btn" });
    act(() => {
      cancelBtn.props.onPress();
    });

    expect(handleRangeChange).not.toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it("should support imperative setRange ref method", () => {
    const ref = React.createRef<any>();
    const handleRangeChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianDatePicker
          ref={ref}
          selectionType="range"
          onRangeChange={handleRangeChange}
          testID="eth-picker"
        />,
      );
    });

    act(() => {
      ref.current.setRange({ startDate: sampleStart, endDate: sampleEnd });
    });

    expect(handleRangeChange).toHaveBeenCalledWith({
      startDate: sampleStart,
      endDate: sampleEnd,
    });
  });
});
