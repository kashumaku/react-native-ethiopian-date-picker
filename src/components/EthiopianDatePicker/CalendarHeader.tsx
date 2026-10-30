import React from "react";
import { View, Text, Pressable } from "react-native";
import { getEthiopianMonthName } from "../../calendar/months";
import { getLocalization } from "../../localization";
import { styles, type ResolvedTheme } from "./styles";
import type { CalendarType, EthiopianLocale } from "../../types";

export interface CalendarHeaderProps {
  year: number;
  month: number;
  calendarSystem: CalendarType;
  onCalendarSystemChange: (calendar: CalendarType) => void;
  locale: EthiopianLocale;
  theme: ResolvedTheme;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToggleMonthYearSelector: () => void;
  isMonthYearSelectorOpen: boolean;
  disabled?: boolean;
  testID?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = React.memo(
  ({
    year,
    month,
    calendarSystem,
    onCalendarSystemChange,
    locale,
    theme,
    onPreviousMonth,
    onNextMonth,
    onToggleMonthYearSelector,
    isMonthYearSelectorOpen,
    disabled = false,
    testID,
  }) => {
    const dict = getLocalization(locale);
    const monthName = calendarSystem === "ethiopian"
      ? getEthiopianMonthName(month, locale)
      : (dict.gregorianMonths[month - 1] ?? "");
    const calendarName = (system: CalendarType) =>
      locale === "am"
        ? system === "ethiopian" ? "ኢትዮጵያዊ" : "ግሪጎሪያን"
        : system === "ethiopian" ? "Ethiopian" : "Gregorian";

    return (
      <View>
        <View style={styles.header}>
          <Pressable
            testID={testID ? `${testID}-prev-month` : undefined}
            accessibilityRole="button"
            accessibilityLabel={dict.previousMonth}
            disabled={disabled}
            onPress={onPreviousMonth}
            style={[styles.headerNavButton, { backgroundColor: theme.surfaceColor }]}
            android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true, radius: 22 }}
          >
            <Text style={[styles.navArrow, { color: theme.primaryColor }]}>‹</Text>
          </Pressable>

          <Pressable
            testID={testID ? `${testID}-toggle-selector` : undefined}
            accessibilityRole="button"
            accessibilityLabel={`${monthName} ${year}, select month and year`}
            accessibilityState={{ expanded: isMonthYearSelectorOpen }}
            disabled={disabled}
            onPress={onToggleMonthYearSelector}
            style={[
              styles.headerTitleContainer,
              { backgroundColor: isMonthYearSelectorOpen ? theme.surfaceColor : "transparent" },
            ]}
          >
            <Text style={[styles.headerTitle, { color: theme.headerTextColor }]}>
              {monthName} {year} {isMonthYearSelectorOpen ? "▲" : "▼"}
            </Text>
          </Pressable>

          <Pressable
            testID={testID ? `${testID}-next-month` : undefined}
            accessibilityRole="button"
            accessibilityLabel={dict.nextMonth}
            disabled={disabled}
            onPress={onNextMonth}
            style={[styles.headerNavButton, { backgroundColor: theme.surfaceColor }]}
            android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true, radius: 22 }}
          >
            <Text style={[styles.navArrow, { color: theme.primaryColor }]}>›</Text>
          </Pressable>
        </View>

        <View
          style={[styles.calendarTabs, { backgroundColor: theme.surfaceColor }]}
          accessibilityRole="tablist"
        >
          {(["gregorian", "ethiopian"] as const).map((system) => {
            const selected = calendarSystem === system;
            return (
              <Pressable
                key={system}
                testID={testID ? `${testID}-calendar-${system}` : undefined}
                accessibilityRole="tab"
                accessibilityLabel={calendarName(system)}
                accessibilityState={{ selected }}
                disabled={disabled}
                onPress={() => onCalendarSystemChange(system)}
                style={[styles.calendarTab, { backgroundColor: selected ? theme.backgroundColor : "transparent" }]}
              >
                <Text style={[styles.calendarTabText, { color: selected ? theme.primaryColor : theme.mutedTextColor }]}>
                  {calendarName(system)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  },
);
