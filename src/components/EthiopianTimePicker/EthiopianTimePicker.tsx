import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { StyleSheet, View, Text, Pressable, useWindowDimensions } from "react-native";
import { resolveTheme } from "../EthiopianDatePicker/styles";
import { DatePickerModal } from "../EthiopianDatePicker/DatePickerModal";
import {
  gregorianToEthiopianTime,
  ethiopianToGregorianTime,
  getTimePeriodName,
} from "../../calendar/time";
import { getLocalization } from "../../localization";
import type {
  EthiopianTime,
  EthiopianTimePeriod,
  EthiopianTimePickerProps,
  EthiopianTimePickerRef,
} from "../../types";

interface ClockDialProps {
  size: number;
  hour: number;
  selectedMinute: number;
  minuteInterval: number;
  onSelectHour: (hour: number) => void;
  onSelectMinute: (minute: number) => void;
  primaryColor: string;
  textColor: string;
  mutedTextColor: string;
  selectedTextColor: string;
  surfaceColor: string;
  disabled: boolean;
  testID: string;
}

function RingProgress({
  center,
  radius,
  thickness,
  progress,
  color,
  trackColor,
}: {
  center: number;
  radius: number;
  thickness: number;
  progress: number;
  color: string;
  trackColor: string;
}) {
  const segmentCount = 120;
  const segmentLength = (2 * Math.PI * radius / segmentCount) + 1;

  return (
    <>
      {Array.from({ length: segmentCount }, (_, index) => {
        const angle = index * 360 / segmentCount;
        const radians = angle * Math.PI / 180;
        const isActive = index / segmentCount < progress;
        return (
          <View
            key={index}
            pointerEvents="none"
            style={[
              wheelStyles.ringSegment,
              {
                width: segmentLength,
                height: thickness,
                left: center + radius * Math.sin(radians) - segmentLength / 2,
                top: center - radius * Math.cos(radians) - thickness / 2,
                borderRadius: thickness / 2,
                backgroundColor: isActive ? color : trackColor,
                transform: [{ rotate: `${angle + 90}deg` }],
              },
            ]}
          />
        );
      })}
    </>
  );
}

function ClockDial({
  size,
  hour,
  selectedMinute,
  minuteInterval,
  onSelectHour,
  onSelectMinute,
  primaryColor,
  textColor,
  mutedTextColor,
  selectedTextColor,
  surfaceColor,
  disabled,
  testID,
}: ClockDialProps) {
  const center = size / 2;
  const minuteRadius = size * 0.43;
  const hourRadius = size * 0.27;
  const hourAngle = ((hour % 12) / 12) * 360;
  const minuteAngle = (selectedMinute / 60) * 360;
  const minuteValues = Array.from({ length: 60 / minuteInterval }, (_, index) => index * minuteInterval);
  const handStyle = (radius: number, angle: number) => ({
    height: radius,
    left: center - 1 + radius / 2 * Math.sin(angle * Math.PI / 180),
    top: center - radius / 2 - radius / 2 * Math.cos(angle * Math.PI / 180),
    transform: [{ rotate: `${angle}deg` }],
  });

  return (
    <View style={[wheelStyles.dial, { width: size, height: size }]} accessibilityRole="radiogroup">
      <RingProgress
        center={center}
        radius={hourRadius}
        thickness={1.5}
        progress={(hour % 12) / 12}
        color={primaryColor}
        trackColor={mutedTextColor}
      />
      <RingProgress
        center={center}
        radius={minuteRadius}
        thickness={1.5}
        progress={selectedMinute / 60}
        color={primaryColor}
        trackColor={mutedTextColor}
      />
      <View
        pointerEvents="none"
        testID={`${testID}-hour-hand`}
        style={[
          wheelStyles.dialHand,
          handStyle(hourRadius, hourAngle),
          { backgroundColor: primaryColor },
        ]}
      />
      <View
        pointerEvents="none"
        testID={`${testID}-minute-hand`}
        style={[wheelStyles.dialHand, handStyle(minuteRadius, minuteAngle), { backgroundColor: primaryColor, opacity: 0.5 }]}
      />

      {Array.from({ length: 12 }, (_, index) => {
        const value = index + 1;
        const angle = (value % 12) * 2 * Math.PI / 12;
        const selected = value === hour;
        const itemSize = Math.max(24, size * 0.09);
        return (
          <Pressable
            key={`hour-${value}`}
            testID={`${testID}-hour-${value}`}
            accessibilityRole="radio"
            accessibilityLabel={`${String(value).padStart(2, "0")} hours`}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onSelectHour(value)}
            style={[
              wheelStyles.dialNumber,
              {
                width: itemSize,
                height: itemSize,
                left: center + size * 0.25 * Math.sin(angle) - itemSize / 2,
                top: center - size * 0.25 * Math.cos(angle) - itemSize / 2,
                borderRadius: itemSize / 2,
                borderColor: primaryColor,
                borderWidth: selected ? 0 : 1,
                backgroundColor: selected ? primaryColor : surfaceColor,
              },
            ]}
          >
            <Text style={[
              wheelStyles.dialNumberText,
              { color: selected ? selectedTextColor : primaryColor, fontSize: 12 },
            ]}>
              {value}
            </Text>
          </Pressable>
        );
      })}
      {minuteValues.map((value) => {
        const angle = (value / 60) * 2 * Math.PI;
        const selected = value === selectedMinute;
        const itemSize = Math.max(26, size * 0.1);
        return (
          <Pressable
            key={`minute-${value}`}
            testID={`${testID}-minute-${value}`}
            accessibilityRole="radio"
            accessibilityLabel={`${String(value).padStart(2, "0")} minutes`}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onSelectMinute(value)}
            style={[
              wheelStyles.minuteMarker,
              {
                width: itemSize,
                height: itemSize,
                left: center + minuteRadius * Math.sin(angle) - itemSize / 2,
                top: center - minuteRadius * Math.cos(angle) - itemSize / 2,
                borderRadius: itemSize / 2,
                borderColor: primaryColor,
                borderWidth: selected ? 0 : 1,
                backgroundColor: selected ? primaryColor : surfaceColor,
              },
            ]}
          >
            <Text style={[
              wheelStyles.minuteMarkerText,
              { color: selected ? selectedTextColor : primaryColor, fontSize: 10 },
            ]}>
              {String(value).padStart(2, "0")}
            </Text>
          </Pressable>
        );
      })}
      <View
        pointerEvents="none"
        style={[wheelStyles.dialCenter, { left: center - 3, top: center - 3, backgroundColor: primaryColor }]}
      />
    </View>
  );
}

export const EthiopianTimePicker = forwardRef<
  EthiopianTimePickerRef,
  EthiopianTimePickerProps
>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    locale = "en",
    mode = "inline",
    pickerStyle = "clock",
    is24Hour = false,
    useEthiopianConvention = false,
    minuteInterval = 5,
    defaultVisible = false,
    visible: controlledVisible,
    onOpen,
    onClose,
    title,
    confirmText,
    cancelText,
    theme: customTheme,
    style,
    disabled = false,
    testID = "eth-time-picker",
  } = props;

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const dialSize = Math.max(180, Math.min(270, screenWidth - 112, screenHeight - 430));
  const resolvedTheme = resolveTheme(customTheme);
  const dict = getLocalization(locale);

  const extractTime = (v: Date | EthiopianTime | null | undefined): EthiopianTime => {
    if (v instanceof Date) {
      return { hours: v.getHours(), minutes: v.getMinutes() };
    }
    if (v && typeof v.hours === "number" && typeof v.minutes === "number") {
      return { hours: v.hours, minutes: v.minutes };
    }
    const now = new Date();
    return { hours: now.getHours(), minutes: now.getMinutes() };
  };

  const isControlled = value !== undefined;
  const initialTime = extractTime(value ?? defaultValue);

  const [uncontrolledTime, setUncontrolledTime] = useState<EthiopianTime>(initialTime);
  const activeTime = isControlled ? extractTime(value) : uncontrolledTime;

  const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultVisible);
  const isModalVisible = controlledVisible !== undefined ? controlledVisible : uncontrolledVisible;

  const [draftHours, setDraftHours] = useState<number>(activeTime.hours);
  const [draftMinutes, setDraftMinutes] = useState<number>(activeTime.minutes);

  useEffect(() => {
    if (value !== undefined) {
      const t = extractTime(value);
      setDraftHours(t.hours);
      setDraftMinutes(t.minutes);
    }
  }, [value]);

  useEffect(() => {
    if (isModalVisible) {
      setDraftHours(activeTime.hours);
      setDraftMinutes(activeTime.minutes);
    }
  }, [isModalVisible]);

  const openModal = useCallback(() => {
    if (controlledVisible === undefined) setUncontrolledVisible(true);
    onOpen?.();
  }, [controlledVisible, onOpen]);

  const closeModal = useCallback(() => {
    if (controlledVisible === undefined) setUncontrolledVisible(false);
    onClose?.();
  }, [controlledVisible, onClose]);

  const setTimeImperative = useCallback((newTime: EthiopianTime) => {
    setDraftHours(newTime.hours);
    setDraftMinutes(newTime.minutes);
    if (!isControlled) setUncontrolledTime(newTime);
  }, [isControlled]);

  useImperativeHandle(ref, () => ({
    open: openModal,
    close: closeModal,
    setTime: setTimeImperative,
  }));

  const isOverlayMode = mode === "modal" || mode === "sheet";
  const currentHours = isOverlayMode ? draftHours : activeTime.hours;
  const currentMinutes = isOverlayMode ? draftMinutes : activeTime.minutes;

  let displayHour: number;
  let ethPeriod: EthiopianTimePeriod | undefined;

  if (useEthiopianConvention) {
    const eth = gregorianToEthiopianTime(currentHours, currentMinutes);
    displayHour = eth.hours;
    ethPeriod = eth.period;
  } else if (is24Hour) {
    displayHour = currentHours;
  } else {
    displayHour = currentHours % 12 === 0 ? 12 : currentHours % 12;
  }

  const updateTime = (newHours: number, newMinutes: number) => {
    const clampedH = ((newHours % 24) + 24) % 24;
    const clampedM = ((newMinutes % 60) + 60) % 60;
    const newTime = { hours: clampedH, minutes: clampedM };
    const dateObj = new Date();
    dateObj.setHours(clampedH, clampedM, 0, 0);

    if (isOverlayMode) {
      setDraftHours(clampedH);
      setDraftMinutes(clampedM);
    } else {
      if (!isControlled) setUncontrolledTime(newTime);
      onChange?.(newTime, dateObj);
    }
  };

  const handleConfirm = () => {
    const finalTime = { hours: draftHours, minutes: draftMinutes };
    const dateObj = new Date();
    dateObj.setHours(draftHours, draftMinutes, 0, 0);

    if (!isControlled) setUncontrolledTime(finalTime);
    onChange?.(finalTime, dateObj);
    closeModal();
  };

  const minuteOptions: number[] = Array.from(
    { length: Math.floor(60 / minuteInterval) },
    (_, i) => i * minuteInterval,
  );

  const periodOptions: ("AM" | "PM" | EthiopianTimePeriod)[] = useEthiopianConvention
    ? ["morning", "afternoon", "evening", "night"]
    : ["AM", "PM"];

  const fallbackMinute = minuteOptions[0] ?? 0;
  const closestMinute = minuteOptions.reduce((prev: number, curr: number) =>
    Math.abs(curr - currentMinutes) < Math.abs(prev - currentMinutes) ? curr : prev,
    fallbackMinute
  );
  const currentPeriodKey = useEthiopianConvention
    ? ethPeriod ?? "morning"
    : currentHours >= 12 ? "PM" : "AM";
  const dialHour = displayHour > 12 ? displayHour - 12 : displayHour === 0 ? 12 : displayHour;

  const onSelectHour = (newHour: number) => {
    if (useEthiopianConvention && ethPeriod) {
      const greg = ethiopianToGregorianTime(newHour, currentMinutes, ethPeriod);
      updateTime(greg.hours, currentMinutes);
    } else {
      const isPm = currentHours >= 12;
      const h24 = newHour === 12 ? (isPm ? 12 : 0) : (isPm ? newHour + 12 : newHour);
      updateTime(h24, currentMinutes);
    }
  };

  const onSelectMinute = (newMinute: number) => {
    updateTime(currentHours, newMinute);
  };

  const stepHour = (step: number) => {
    if (is24Hour && !useEthiopianConvention) {
      updateTime(currentHours + step, currentMinutes);
      return;
    }
    const nextHour = ((dialHour - 1 + step + 12) % 12) + 1;
    onSelectHour(nextHour);
  };

  const stepMinute = (step: number) => {
    const nextMinute = (closestMinute + step * minuteInterval + 60) % 60;
    onSelectMinute(nextMinute);
  };

  const onSelectPeriod = (targetPeriod: "AM" | "PM" | EthiopianTimePeriod) => {
    if (useEthiopianConvention) {
      const greg = ethiopianToGregorianTime(displayHour, currentMinutes, targetPeriod as EthiopianTimePeriod);
      updateTime(greg.hours, currentMinutes);
    } else {
      const isCurrentlyPm = currentHours >= 12;
      if (targetPeriod === "AM" && isCurrentlyPm) {
        updateTime(currentHours - 12, currentMinutes);
      } else if (targetPeriod === "PM" && !isCurrentlyPm) {
        updateTime(currentHours + 12, currentMinutes);
      }
    }
  };

  const formatPeriodLabel = (p: "AM" | "PM" | EthiopianTimePeriod): string => {
    if (useEthiopianConvention) {
      return getTimePeriodName(p as EthiopianTimePeriod, locale);
    }
    return p;
  };

  const periodSelector = !is24Hour ? (
    <View style={wheelStyles.periodSelector}>
      {periodOptions.map((period) => {
        const selected = period === currentPeriodKey;
        return (
          <Pressable
            key={period}
            testID={`${testID}-period-${period}`}
            accessibilityRole="radio"
            accessibilityLabel={formatPeriodLabel(period)}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onSelectPeriod(period)}
            style={[
              wheelStyles.periodOption,
              { backgroundColor: selected ? resolvedTheme.backgroundColor : "transparent" },
            ]}
          >
            <Text style={[
              wheelStyles.periodOptionText,
              { color: selected ? resolvedTheme.primaryColor : resolvedTheme.mutedTextColor },
            ]}>
              {formatPeriodLabel(period)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  ) : null;

  const renderContent = () => (
    <View
      style={[
        wheelStyles.container,
        {
          backgroundColor: resolvedTheme.backgroundColor,
          borderRadius: resolvedTheme.borderRadius,
        },
        style,
      ]}
      testID={testID}
    >
      {pickerStyle === "clock" && <View style={wheelStyles.displayRow}>
        <View testID={`${testID}-hours-segment`} style={wheelStyles.timeBlock}>
          <Text style={[wheelStyles.timeText, { color: resolvedTheme.primaryColor }]}>
            {String(displayHour).padStart(2, "0")}
          </Text>
        </View>

        <Text style={[wheelStyles.colon, { color: resolvedTheme.textColor }]}>:</Text>

        <View testID={`${testID}-minutes-segment`} style={wheelStyles.timeBlock}>
          <Text style={[wheelStyles.timeText, { color: resolvedTheme.primaryColor }]}>
            {String(currentMinutes).padStart(2, "0")}
          </Text>
        </View>

        {periodSelector}
      </View>}

      {pickerStyle === "clock" ? <ClockDial
        size={dialSize}
        hour={dialHour}
        selectedMinute={closestMinute}
        minuteInterval={minuteInterval}
        onSelectHour={onSelectHour}
        onSelectMinute={onSelectMinute}
        primaryColor={resolvedTheme.primaryColor}
        textColor={resolvedTheme.textColor}
        mutedTextColor={resolvedTheme.mutedTextColor}
        selectedTextColor={resolvedTheme.selectedDayTextColor}
        surfaceColor={resolvedTheme.backgroundColor}
        disabled={disabled}
        testID={testID}
      /> : (
        <View style={wheelStyles.stepperRow}>
          <View style={[wheelStyles.stepperField, { backgroundColor: resolvedTheme.surfaceColor }]}>
            <Text style={[wheelStyles.stepperLabel, { color: resolvedTheme.mutedTextColor }]}>
              {locale === "am" ? "ሰዓት" : "HOUR"}
            </Text>
            <Pressable
              testID={`${testID}-hour-up`}
              accessibilityRole="button"
              accessibilityLabel={locale === "am" ? "ሰዓት ጨምር" : "Increase hour"}
              accessibilityState={{ disabled }}
              disabled={disabled}
              onPress={() => stepHour(1)}
              style={[wheelStyles.stepperButton, { backgroundColor: resolvedTheme.backgroundColor }]}
            >
              <Text style={[wheelStyles.stepperArrow, { color: resolvedTheme.primaryColor }]}>⌃</Text>
            </Pressable>
            <Text testID={`${testID}-stepper-hour-value`} style={[wheelStyles.stepperValue, { color: resolvedTheme.textColor }]}>
              {String(is24Hour && !useEthiopianConvention ? displayHour : dialHour).padStart(2, "0")}
            </Text>
            <Pressable
              testID={`${testID}-hour-down`}
              accessibilityRole="button"
              accessibilityLabel={locale === "am" ? "ሰዓት ቀንስ" : "Decrease hour"}
              accessibilityState={{ disabled }}
              disabled={disabled}
              onPress={() => stepHour(-1)}
              style={[wheelStyles.stepperButton, { backgroundColor: resolvedTheme.backgroundColor }]}
            >
              <Text style={[wheelStyles.stepperArrow, { color: resolvedTheme.primaryColor }]}>⌄</Text>
            </Pressable>
          </View>

          <Text style={[wheelStyles.stepperColon, { color: resolvedTheme.primaryColor }]}>:</Text>

          <View style={[wheelStyles.stepperField, { backgroundColor: resolvedTheme.surfaceColor }]}>
            <Text style={[wheelStyles.stepperLabel, { color: resolvedTheme.mutedTextColor }]}>
              {locale === "am" ? "ደቂቃ" : "MINUTE"}
            </Text>
            <Pressable
              testID={`${testID}-minute-up`}
              accessibilityRole="button"
              accessibilityLabel={locale === "am" ? "ደቂቃ ጨምር" : "Increase minute"}
              accessibilityState={{ disabled }}
              disabled={disabled}
              onPress={() => stepMinute(1)}
              style={[wheelStyles.stepperButton, { backgroundColor: resolvedTheme.backgroundColor }]}
            >
              <Text style={[wheelStyles.stepperArrow, { color: resolvedTheme.primaryColor }]}>⌃</Text>
            </Pressable>
            <Text testID={`${testID}-stepper-minute-value`} style={[wheelStyles.stepperValue, { color: resolvedTheme.textColor }]}>
              {String(currentMinutes).padStart(2, "0")}
            </Text>
            <Pressable
              testID={`${testID}-minute-down`}
              accessibilityRole="button"
              accessibilityLabel={locale === "am" ? "ደቂቃ ቀንስ" : "Decrease minute"}
              accessibilityState={{ disabled }}
              disabled={disabled}
              onPress={() => stepMinute(-1)}
              style={[wheelStyles.stepperButton, { backgroundColor: resolvedTheme.backgroundColor }]}
            >
              <Text style={[wheelStyles.stepperArrow, { color: resolvedTheme.primaryColor }]}>⌄</Text>
            </Pressable>
          </View>
          {periodSelector}
        </View>
      )}

    </View>
  );

  if (mode === "modal" || mode === "sheet") {
    return (
      <DatePickerModal
        visible={isModalVisible}
        presentationMode={mode}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={title}
        confirmText={confirmText ?? dict.confirm}
        cancelText={cancelText ?? dict.cancel}
        locale={locale}
        theme={resolvedTheme}
        testID={testID}
      >
        {renderContent()}
      </DatePickerModal>
    );
  }

  return renderContent();
});

EthiopianTimePicker.displayName = "EthiopianTimePicker";

const wheelStyles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  displayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 4,
    borderRadius: 14,
  },
  timeBlock: {
    minWidth: 48,
    minHeight: 46,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  timeText: {
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.5,
    textAlign: "center",
    includeFontPadding: false,
  },
  colon: {
    fontSize: 22,
    fontWeight: "500",
    marginHorizontal: 8,
  },
  dial: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 6,
  },
  ringSegment: {
    position: "absolute",
    zIndex: 0,
  },
  minuteMarker: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  minuteMarkerText: {
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
  },
  dialHand: {
    position: "absolute",
    width: 2,
    zIndex: 0,
  },
  dialCenter: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 2,
  },
  dialNumber: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  dialNumberText: {
    fontWeight: "600",
    letterSpacing: -0.5,
    textAlign: "center",
    includeFontPadding: false,
  },
  periodSelector: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    minWidth: 52,
    padding: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  periodOption: {
    minHeight: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderRadius: 7,
  },
  periodOptionText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    includeFontPadding: false,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 28,
  },
  stepperField: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 18,
  },
  stepperLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  stepperButton: {
    width: 42,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
  },
  stepperArrow: {
    fontSize: 19,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  stepperValue: {
    fontSize: 34,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    marginVertical: 3,
    textAlign: "center",
    includeFontPadding: false,
  },
  stepperColon: {
    fontSize: 28,
    fontWeight: "700",
    marginHorizontal: 8,
  },
});
