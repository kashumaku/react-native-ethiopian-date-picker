import React from "react";
import { View, Text, Pressable } from "react-native";
import { getEthiopianMonthName } from "../../calendar/months";
import { getLocalization } from "../../localization";
import { styles, type ResolvedTheme } from "./styles";
import type { EthiopianLocale } from "../../types";

export interface CalendarHeaderProps {
  year: number;
  month: number;
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
    const monthName = getEthiopianMonthName(month, locale);

    return (
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
    );
  },
);
