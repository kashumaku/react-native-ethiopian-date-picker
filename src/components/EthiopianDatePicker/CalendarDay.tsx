import React from "react";
import { View, Text, Pressable } from "react-native";
import { getEthiopianMonthName } from "../../calendar/months";
import { styles, type ResolvedTheme } from "./styles";
import type { EthiopianLocale } from "../../types";

export type DayRangePosition = "start" | "end" | "in-range" | "single" | "none";

export interface CalendarDayProps {
  dayNumber: number | null;
  year: number;
  month: number;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  rangePosition?: DayRangePosition;
  onSelect: (day: number) => void;
  locale: EthiopianLocale;
  theme: ResolvedTheme;
  testID?: string;
}

export const CalendarDay: React.FC<CalendarDayProps> = React.memo(
  ({
    dayNumber,
    year,
    month,
    isSelected,
    isToday,
    isDisabled,
    rangePosition = "none",
    onSelect,
    locale,
    theme,
    testID,
  }) => {
    if (dayNumber === null) {
      return <View style={styles.dayCellWrapper} />;
    }

    const monthName = getEthiopianMonthName(month, locale);
    const accessibilityLabel = `${dayNumber} ${monthName} ${year}${isToday ? ", Today" : ""}`;

    const isRangeStart = rangePosition === "start";
    const isRangeEnd = rangePosition === "end";
    const isInRange = rangePosition === "in-range";
    const isRangeEndpoint = isRangeStart || isRangeEnd || rangePosition === "single";

    const buttonStyle = [
      styles.dayButton,
      isSelected && { backgroundColor: theme.selectedDayBackgroundColor },
      isRangeEndpoint && { backgroundColor: theme.rangeStartEndBackgroundColor },
      isInRange && { backgroundColor: "transparent" },
      isToday && !isSelected && !isRangeEndpoint && [
        styles.todayDayButton,
        { borderColor: theme.todayBorderColor },
      ],
      isDisabled && { backgroundColor: theme.disabledBackgroundColor },
    ];

    const textStyle = [
      styles.dayText,
      { color: theme.textColor },
      isSelected && [
        styles.selectedDayText,
        { color: theme.selectedDayTextColor },
      ],
      isRangeEndpoint && [
        styles.selectedDayText,
        { color: theme.rangeStartEndTextColor },
      ],
      isInRange && [
        styles.selectedDayText,
        { color: theme.rangeTextColor },
      ],
      isToday && !isSelected && !isRangeEndpoint && [
        styles.todayDayText,
        { color: theme.todayTextColor },
      ],
      isDisabled && { color: theme.disabledTextColor },
    ];

    return (
      <View style={styles.dayCellWrapper}>
        {/* Background Range Connectors */}
        {isRangeStart && (
          <View
            style={[
              styles.rangeBackgroundStart,
              { backgroundColor: theme.rangeBackgroundColor },
            ]}
          />
        )}
        {isRangeEnd && (
          <View
            style={[
              styles.rangeBackgroundEnd,
              { backgroundColor: theme.rangeBackgroundColor },
            ]}
          />
        )}
        {isInRange && (
          <View
            style={[
              styles.rangeBackgroundMiddle,
              { backgroundColor: theme.rangeBackgroundColor },
            ]}
          />
        )}

        <Pressable
          testID={testID ? `${testID}-day-${dayNumber}` : undefined}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ selected: isSelected || isRangeEndpoint, disabled: isDisabled }}
          disabled={isDisabled}
          onPress={() => onSelect(dayNumber)}
          style={buttonStyle}
          android_ripple={{
            color: "rgba(0, 0, 0, 0.12)",
            borderless: true,
            radius: 20,
          }}
        >
          <Text style={textStyle}>{dayNumber}</Text>
        </Pressable>
      </View>
    );
  },
);
