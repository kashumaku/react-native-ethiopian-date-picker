import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
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

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING_COUNT = Math.floor(VISIBLE_ITEMS / 2);

interface SlidingColumnProps<T> {
  items: T[];
  selectedIndex: number;
  onSelect: (item: T, index: number) => void;
  formatLabel: (item: T) => string;
  testIDPrefix: string;
  primaryColor: string;
  textColor: string;
  mutedTextColor: string;
  disabled?: boolean;
}

function SlidingColumn<T>({
  items,
  selectedIndex,
  onSelect,
  formatLabel,
  testIDPrefix,
  primaryColor,
  textColor,
  mutedTextColor,
  disabled,
}: SlidingColumnProps<T>) {
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);

  // Scroll to selected position
  const scrollToSelected = useCallback((index: number, animated = true) => {
    if (scrollRef.current && index >= 0 && index < items.length) {
      scrollRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated });
    }
  }, [items.length]);

  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollToSelected(selectedIndex, false);
    }
  }, [selectedIndex, scrollToSelected]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    isUserScrolling.current = false;
    const offsetY = e.nativeEvent.contentOffset.y;
    let index = Math.round(offsetY / ITEM_HEIGHT);
    index = Math.max(0, Math.min(items.length - 1, index));
    if (index !== selectedIndex && items[index] !== undefined) {
      onSelect(items[index]!, index);
    }
  };

  return (
    <View style={wheelStyles.columnContainer}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScrollBeginDrag={() => { isUserScrolling.current = true; }}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{
          paddingVertical: PADDING_COUNT * ITEM_HEIGHT,
        }}
        scrollEnabled={!disabled}
      >
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <Pressable
              key={idx}
              testID={`${testIDPrefix}-${String(item)}`}
              style={wheelStyles.wheelItem}
              onPress={() => {
                scrollToSelected(idx, true);
                onSelect(item, idx);
              }}
              disabled={disabled}
            >
              <Text
                style={[
                  wheelStyles.wheelItemText,
                  {
                    color: isSelected ? primaryColor : mutedTextColor,
                    fontWeight: isSelected ? "700" : "500",
                    fontSize: isSelected ? 20 : 16,
                    opacity: isSelected ? 1 : 0.45,
                  },
                ]}
              >
                {formatLabel(item)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
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
    is24Hour = false,
    useEthiopianConvention = false,
    minuteInterval = 1,
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
  let displayPeriod: string = "";
  let ethPeriod: EthiopianTimePeriod | undefined;

  if (useEthiopianConvention) {
    const eth = gregorianToEthiopianTime(currentHours, currentMinutes);
    displayHour = eth.hours;
    ethPeriod = eth.period;
    displayPeriod = getTimePeriodName(eth.period, locale);
  } else if (is24Hour) {
    displayHour = currentHours;
  } else {
    displayHour = currentHours % 12 === 0 ? 12 : currentHours % 12;
    const isPm = currentHours >= 12;
    displayPeriod = isPm
      ? locale === "am"
        ? "ከሰዓት"
        : "PM"
      : locale === "am"
      ? "ከጠዋት"
      : "AM";
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

  const hourOptions: number[] = useEthiopianConvention || !is24Hour
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    : Array.from({ length: 24 }, (_, i) => i);

  const minuteOptions: number[] = Array.from(
    { length: Math.floor(60 / minuteInterval) },
    (_, i) => i * minuteInterval,
  );

  const periodOptions: ("AM" | "PM" | EthiopianTimePeriod)[] = useEthiopianConvention
    ? ["morning", "afternoon", "evening", "night"]
    : ["AM", "PM"];

  const selectedHourIndex = Math.max(0, hourOptions.indexOf(displayHour));
  const fallbackMinute = minuteOptions[0] ?? 0;
  const closestMinute = minuteOptions.reduce((prev: number, curr: number) =>
    Math.abs(curr - currentMinutes) < Math.abs(prev - currentMinutes) ? curr : prev,
    fallbackMinute
  );
  const selectedMinuteIndex = Math.max(0, minuteOptions.indexOf(closestMinute));

  const currentPeriodKey = useEthiopianConvention
    ? ethPeriod ?? "morning"
    : currentHours >= 12 ? "PM" : "AM";
  const selectedPeriodIndex = Math.max(0, periodOptions.indexOf(currentPeriodKey as any));

  const onSelectHour = (newHour: number) => {
    if (useEthiopianConvention && ethPeriod) {
      const greg = ethiopianToGregorianTime(newHour, currentMinutes, ethPeriod);
      updateTime(greg.hours, currentMinutes);
    } else if (!is24Hour) {
      const isPm = currentHours >= 12;
      const h24 = newHour === 12 ? (isPm ? 12 : 0) : (isPm ? newHour + 12 : newHour);
      updateTime(h24, currentMinutes);
    } else {
      updateTime(newHour, currentMinutes);
    }
  };

  const onSelectMinute = (newMinute: number) => {
    updateTime(currentHours, newMinute);
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
    return p === "AM" ? (locale === "am" ? "ከጠዋት" : "AM") : (locale === "am" ? "ከሰዓት" : "PM");
  };

  const renderContent = () => (
    <View
      style={[
        wheelStyles.container,
        {
          backgroundColor: resolvedTheme.backgroundColor,
          borderColor: resolvedTheme.borderColor,
          borderRadius: resolvedTheme.borderRadius,
        },
        style,
      ]}
      testID={testID}
    >
      <View style={wheelStyles.displayRow}>
        <View testID={`${testID}-hours-segment`} style={[wheelStyles.timeBlock, { backgroundColor: resolvedTheme.surfaceColor }]}>
          <Text style={[wheelStyles.timeText, { color: resolvedTheme.primaryColor }]}>
            {String(displayHour).padStart(2, "0")}
          </Text>
        </View>

        <Text style={[wheelStyles.colon, { color: resolvedTheme.textColor }]}>:</Text>

        <View testID={`${testID}-minutes-segment`} style={[wheelStyles.timeBlock, { backgroundColor: resolvedTheme.surfaceColor }]}>
          <Text style={[wheelStyles.timeText, { color: resolvedTheme.primaryColor }]}>
            {String(currentMinutes).padStart(2, "0")}
          </Text>
        </View>

        {!is24Hour && (
          <View style={[wheelStyles.timeBlock, wheelStyles.periodBlock, { backgroundColor: resolvedTheme.surfaceColor }]}>
            <Text style={[wheelStyles.periodDisplayText, { color: resolvedTheme.primaryColor }]}>
              {displayPeriod}
            </Text>
          </View>
        )}
      </View>

      <View style={wheelStyles.columnHeaderRow}>
        <Text style={[wheelStyles.columnHeader, { color: resolvedTheme.mutedTextColor }]}>
          {locale === "am" ? "ሰዓት" : "HOUR"}
        </Text>
        <Text style={[wheelStyles.columnHeader, { color: resolvedTheme.mutedTextColor }]}>
          {locale === "am" ? "ደቂቃ" : "MINUTE"}
        </Text>
        {!is24Hour && (
          <Text style={[wheelStyles.columnHeader, { color: resolvedTheme.mutedTextColor }]}>
            {locale === "am" ? "ክፍለ-ጊዜ" : "PERIOD"}
          </Text>
        )}
      </View>

      <View style={wheelStyles.wheelBox}>
        <View
          pointerEvents="none"
          style={[
            wheelStyles.selectionBar,
            {
              backgroundColor: resolvedTheme.surfaceColor,
              borderColor: resolvedTheme.primaryColor,
            },
          ]}
        />

        <SlidingColumn<number>
          items={hourOptions}
          selectedIndex={selectedHourIndex}
          onSelect={onSelectHour}
          formatLabel={(h) => String(h).padStart(2, "0")}
          testIDPrefix={`${testID}-opt`}
          primaryColor={resolvedTheme.primaryColor}
          textColor={resolvedTheme.textColor}
          mutedTextColor={resolvedTheme.mutedTextColor}
          disabled={disabled}
        />

        <View pointerEvents="none" style={wheelStyles.wheelSeparator}>
          <Text style={[wheelStyles.wheelColon, { color: resolvedTheme.mutedTextColor }]}>:</Text>
        </View>

        <SlidingColumn<number>
          items={minuteOptions}
          selectedIndex={selectedMinuteIndex}
          onSelect={onSelectMinute}
          formatLabel={(m) => String(m).padStart(2, "0")}
          testIDPrefix={`${testID}-opt`}
          primaryColor={resolvedTheme.primaryColor}
          textColor={resolvedTheme.textColor}
          mutedTextColor={resolvedTheme.mutedTextColor}
          disabled={disabled}
        />

        {!is24Hour && (
          <SlidingColumn<"AM" | "PM" | EthiopianTimePeriod>
            items={periodOptions}
            selectedIndex={selectedPeriodIndex}
            onSelect={onSelectPeriod}
            formatLabel={formatPeriodLabel}
            testIDPrefix={`${testID}-period`}
            primaryColor={resolvedTheme.primaryColor}
            textColor={resolvedTheme.textColor}
            mutedTextColor={resolvedTheme.mutedTextColor}
            disabled={disabled}
          />
        )}
      </View>
    </View>
  );

  if (mode === "modal" || mode === "sheet") {
    return (
      <DatePickerModal
        visible={isModalVisible}
        presentationMode={mode}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={title ?? (locale === "am" ? "ሰዓት ይምረጡ" : "Select Time")}
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
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  displayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  timeBlock: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  periodBlock: {
    marginLeft: 10,
  },
  timeText: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  periodDisplayText: {
    fontSize: 16,
    fontWeight: "700",
  },
  colon: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 8,
  },
  columnHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  columnHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  wheelBox: {
    height: WHEEL_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  selectionBar: {
    position: "absolute",
    top: PADDING_COUNT * ITEM_HEIGHT,
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  columnContainer: {
    flex: 1,
    height: WHEEL_HEIGHT,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelItemText: {
    letterSpacing: -0.2,
  },
  wheelSeparator: {
    width: 14,
    alignItems: "center",
    justifyContent: "center",
    height: WHEEL_HEIGHT,
  },
  wheelColon: {
    fontSize: 18,
    fontWeight: "700",
  },
});
