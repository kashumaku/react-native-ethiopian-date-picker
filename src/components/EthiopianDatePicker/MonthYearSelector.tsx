import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { getAllEthiopianMonths } from "../../calendar/months";
import type { CalendarType } from "../../types";
import { getLocalization } from "../../localization";
import { styles, type ResolvedTheme } from "./styles";
import type { EthiopianLocale } from "../../types";

export interface MonthYearSelectorProps {
  currentYear: number;
  currentMonth: number;
  calendarSystem?: CalendarType;
  onSelect: (year: number, month: number) => void;
  locale: EthiopianLocale;
  theme: ResolvedTheme;
  minYear?: number;
  maxYear?: number;
  testID?: string;
}

export const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  currentYear,
  currentMonth,
  calendarSystem = "ethiopian",
  onSelect,
  locale,
  theme,
  minYear = 1900,
  maxYear = 2100,
  testID,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  useEffect(() => setSelectedYear(currentYear), [currentYear]);
  const dict = getLocalization(locale);
  const months = calendarSystem === "ethiopian"
    ? getAllEthiopianMonths().map((m) => ({ number: m.number, name: m.name, shortName: m.shortName, nameAm: m.nameAm, shortNameAm: m.shortNameAm }))
    : dict.gregorianMonths.map((name, index) => ({
        number: index + 1,
        name,
        shortName: dict.gregorianShortMonths[index] ?? name,
        nameAm: name,
        shortNameAm: dict.gregorianShortMonths[index] ?? name,
      }));

  const handlePrevYear = () => {
    if (selectedYear > minYear) {
      setSelectedYear((y) => y - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < maxYear) {
      setSelectedYear((y) => y + 1);
    }
  };

  return (
    <View
      style={[
        styles.selectorContainer,
        { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor },
      ]}
      testID={testID ? `${testID}-month-year-selector` : undefined}
    >
      {/* Year Selector / Stepper */}
      <View style={styles.yearControl}>
        <Pressable
          testID={testID ? `${testID}-prev-year` : undefined}
          accessibilityRole="button"
          accessibilityLabel={dict.previousYear}
          disabled={selectedYear <= minYear}
          onPress={handlePrevYear}
          style={[styles.headerNavButton, { backgroundColor: theme.backgroundColor }]}
        >
          <Text style={[styles.navArrow, { color: theme.primaryColor }]}>«</Text>
        </Pressable>

        <Text style={[styles.yearText, { color: theme.textColor }]}>{selectedYear}</Text>

        <Pressable
          testID={testID ? `${testID}-next-year` : undefined}
          accessibilityRole="button"
          accessibilityLabel={dict.nextYear}
          disabled={selectedYear >= maxYear}
          onPress={handleNextYear}
          style={[styles.headerNavButton, { backgroundColor: theme.backgroundColor }]}
        >
          <Text style={[styles.navArrow, { color: theme.primaryColor }]}>»</Text>
        </Pressable>
      </View>

      {/* Months Grid */}
      <View style={styles.monthsGrid}>
        {months.map((m) => {
          const isCurrent = m.number === currentMonth && selectedYear === currentYear;
          const monthName = locale === "am" ? m.shortNameAm : m.shortName;

          return (
            <Pressable
              key={m.number}
              testID={testID ? `${testID}-month-btn-${m.number}` : undefined}
              accessibilityRole="button"
              accessibilityLabel={locale === "am" ? m.nameAm : m.name}
              accessibilityState={{ selected: isCurrent }}
              onPress={() => onSelect(selectedYear, m.number)}
              style={[
                styles.monthButton,
                {
                  backgroundColor: isCurrent
                    ? theme.selectedDayBackgroundColor
                    : theme.backgroundColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.monthButtonText,
                  {
                    color: isCurrent ? theme.selectedDayTextColor : theme.textColor,
                  },
                ]}
              >
                {monthName}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
