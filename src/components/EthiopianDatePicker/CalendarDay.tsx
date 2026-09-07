import React from "react";
import { View, Text, Pressable } from "react-native";
import { getEthiopianMonthName } from "../../calendar/months";
import { styles, type ResolvedTheme } from "./styles";
import type { EthiopianLocale } from "../../types";

export interface CalendarDayProps {
  dayNumber: number | null;
  year: number;
  month: number;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
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

    const buttonStyle = [
      styles.dayButton,
      isSelected && { backgroundColor: theme.selectedDayBackgroundColor },
      isToday && !isSelected && [
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
      isToday && !isSelected && [
        styles.todayDayText,
        { color: theme.todayTextColor },
      ],
      isDisabled && { color: theme.disabledTextColor },
    ];

    return (
      <View style={styles.dayCellWrapper}>
        <Pressable
          testID={testID ? `${testID}-day-${dayNumber}` : undefined}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ selected: isSelected, disabled: isDisabled }}
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
