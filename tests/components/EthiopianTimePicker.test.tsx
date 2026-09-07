import React from "react";
import ReactTestRenderer, { act } from "react-test-renderer";
import { EthiopianTimePicker } from "../../src/components/EthiopianTimePicker";
import type { EthiopianTimePickerRef } from "../../src/types";

describe("EthiopianTimePicker Component", () => {
  it("should render inline time picker with given value", () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianTimePicker
          value={{ hours: 14, minutes: 30 }}
          testID="eth-time"
        />
      );
    });

    const root = tree.root;
    const hoursSegment = root.findByProps({ testID: "eth-time-hours-segment" });
    const minutesSegment = root.findByProps({ testID: "eth-time-minutes-segment" });

    expect(hoursSegment).toBeTruthy();
    expect(minutesSegment).toBeTruthy();

    // 14:30 in 12-hour is 02:30 PM
    expect(hoursSegment.props.children.props.children).toBe("02");
    expect(minutesSegment.props.children.props.children).toBe("30");
  });

  it("should render 24-hour time correctly when is24Hour is true", () => {
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianTimePicker
          value={{ hours: 14, minutes: 30 }}
          is24Hour={true}
          testID="eth-time"
        />
      );
    });

    const root = tree.root;
    const hoursSegment = root.findByProps({ testID: "eth-time-hours-segment" });
    expect(hoursSegment.props.children.props.children).toBe("14");
  });

  it("should render Ethiopian solar time convention when useEthiopianConvention is true", () => {
    let tree: any;
    act(() => {
      // 8:00 AM Gregorian = 2:00 morning Ethiopian (ጠዋት)
      tree = ReactTestRenderer.create(
        <EthiopianTimePicker
          value={{ hours: 8, minutes: 0 }}
          useEthiopianConvention={true}
          locale="am"
          testID="eth-time"
        />
      );
    });

    const root = tree.root;
    const hoursSegment = root.findByProps({ testID: "eth-time-hours-segment" });
    expect(hoursSegment.props.children.props.children).toBe("02");

    const morningPeriod = root.findByProps({ testID: "eth-time-period-morning" });
    expect(morningPeriod).toBeTruthy();
  });

  it("should select hours and minutes in sliding columns", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianTimePicker
          defaultValue={{ hours: 9, minutes: 0 }}
          onChange={handleChange}
          testID="eth-time"
        />
      );
    });

    const root = tree.root;
    const opt4 = root.findByProps({ testID: "eth-time-opt-4" });
    act(() => {
      opt4.props.onPress();
    });

    // Selecting 4 AM -> hours: 4, minutes: 0
    expect(handleChange).toHaveBeenLastCalledWith(
      { hours: 4, minutes: 0 },
      expect.any(Date)
    );

    const opt30 = root.findByProps({ testID: "eth-time-opt-30" });
    act(() => {
      opt30.props.onPress();
    });

    expect(handleChange).toHaveBeenLastCalledWith(
      { hours: 4, minutes: 30 },
      expect.any(Date)
    );
  });

  it("should switch AM/PM periods in 12-hour sliding mode", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianTimePicker
          defaultValue={{ hours: 9, minutes: 0 }}
          onChange={handleChange}
          testID="eth-time"
        />
      );
    });

    const root = tree.root;
    const pmBtn = root.findByProps({ testID: "eth-time-period-PM" });

    act(() => {
      pmBtn.props.onPress();
    });

    expect(handleChange).toHaveBeenLastCalledWith(
      { hours: 21, minutes: 0 },
      expect.any(Date)
    );
  });

  it("should support modal mode with confirm and cancel", () => {
    const handleChange = jest.fn();
    const handleClose = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianTimePicker
          mode="modal"
          visible={true}
          defaultValue={{ hours: 10, minutes: 0 }}
          onChange={handleChange}
          onClose={handleClose}
          testID="eth-time"
        />
      );
    });

    const root = tree.root;
    const opt11 = root.findByProps({ testID: "eth-time-opt-11" });
    act(() => {
      opt11.props.onPress();
    });

    // In modal mode, onChange is not called until confirm
    expect(handleChange).not.toHaveBeenCalled();

    // Confirm modal
    const confirmBtn = root.findByProps({ testID: "eth-time-confirm-btn" });
    act(() => {
      confirmBtn.props.onPress();
    });

    expect(handleChange).toHaveBeenCalledWith(
      { hours: 11, minutes: 0 },
      expect.any(Date)
    );
    expect(handleClose).toHaveBeenCalled();
  });

  it("should support sheet mode with confirm", () => {
    const handleChange = jest.fn();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianTimePicker
          mode="sheet"
          visible={true}
          defaultValue={{ hours: 8, minutes: 15 }}
          onChange={handleChange}
          testID="eth-time"
        />
      );
    });

    const root = tree.root;
    const confirmBtn = root.findByProps({ testID: "eth-time-confirm-btn" });
    act(() => {
      confirmBtn.props.onPress();
    });

    expect(handleChange).toHaveBeenCalledWith(
      { hours: 8, minutes: 15 },
      expect.any(Date)
    );
  });

  it("should support imperative ref methods", () => {
    const ref = React.createRef<EthiopianTimePickerRef>();
    let tree: any;
    act(() => {
      tree = ReactTestRenderer.create(
        <EthiopianTimePicker
          ref={ref}
          mode="modal"
          defaultValue={{ hours: 9, minutes: 0 }}
          testID="eth-time"
        />
      );
    });

    expect(ref.current).toBeDefined();
    expect(typeof ref.current?.open).toBe("function");
    expect(typeof ref.current?.close).toBe("function");
    expect(typeof ref.current?.setTime).toBe("function");

    act(() => {
      ref.current?.setTime?.({ hours: 15, minutes: 45 });
    });

    act(() => {
      ref.current?.open?.();
    });
  });
});
