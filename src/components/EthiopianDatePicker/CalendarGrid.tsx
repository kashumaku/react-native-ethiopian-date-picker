import React, { useMemo } from "react";
import { View } from "react-native";
import { getEthiopianMonthGrid } from "../../calendar/calendarGrid";
import { createGregorianDate, getGregorianMonthGrid } from "../../calendar/gregorian";
import { toGregorian } from "../../conversion/ethiopianToGregorian";
import {
  isSameGregorianDay,
  isBetweenGregorianDays,
} from "../../conversion/comparison";
import { CalendarDay, type DayRangePosition } from "./CalendarDay";
import { styles, type ResolvedTheme } from "./styles";
import type { CalendarType, EthiopianLocale, EthiopianDateRange } from "../../types";

export interface CalendarGridProps {
  year: number;
  month: number;
  calendarSystem?: CalendarType;
  selectionType?: "single" | "range";
  selectedDate: Date | null;
  selectedRange?: EthiopianDateRange | null;
  onSelectDay: (day: number) => void;
  isDayDisabled: (year: number, month: number, day: number) => boolean;
  locale: EthiopianLocale;
  theme: ResolvedTheme;
  testID?: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = React.memo(
  ({
    year,
    month,
    calendarSystem = "ethiopian",
    selectionType = "single",
    selectedDate,
    selectedRange,
    onSelectDay,
    isDayDisabled,
    locale,
    theme,
    testID,
  }) => {
    const gridDays = useMemo(
      () => calendarSystem === "ethiopian" ? getEthiopianMonthGrid(year, month) : getGregorianMonthGrid(year, month),
      [calendarSystem, year, month],
    );

    const weeks = useMemo(() => {
      const rows: Array<Array<number | null>> = [];
      for (let i = 0; i < gridDays.length; i += 7) {
        const row = gridDays.slice(i, i + 7);
        while (row.length < 7) {
          row.push(null);
        }
        rows.push(row);
      }
      return rows;
    }, [gridDays]);

    const validSelectedDate = useMemo(
      () => selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate : null,
      [selectedDate],
    );
    const today = useMemo(() => new Date(), []);

    const startDate = selectedRange?.startDate;
    const endDate = selectedRange?.endDate;

    return (
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.weekRow}>
            {week.map((dayNumber, dayIndex) => {
              if (dayNumber === null) {
                return (
                  <CalendarDay
                    key={`empty-${weekIndex}-${dayIndex}`}
                    dayNumber={null}
                    year={year}
                    month={month}
                    isSelected={false}
                    isToday={false}
                    isDisabled={true}
                    rangePosition="none"
                    onSelect={onSelectDay}
                    locale={locale}
                    theme={theme}
                  />
                );
              }

              const cellDate = calendarSystem === "ethiopian"
                ? toGregorian({ year, month, day: dayNumber })
                : createGregorianDate(year, month, dayNumber);
              const isTodayCell = isSameGregorianDay(today, cellDate);
              const isDisabled = isDayDisabled(year, month, dayNumber);

              let isSelected = false;
              let rangePosition: DayRangePosition = "none";

              if (selectionType === "range") {
                const currentGreg = cellDate;

                if (startDate && !endDate) {
                  if (isSameGregorianDay(currentGreg, startDate)) {
                    isSelected = true;
                    rangePosition = "single";
                  }
                } else if (startDate && endDate) {
                  if (isSameGregorianDay(startDate, endDate)) {
                    if (isSameGregorianDay(currentGreg, startDate)) {
                      isSelected = true;
                      rangePosition = "single";
                    }
                  } else if (isSameGregorianDay(currentGreg, startDate)) {
                    isSelected = true;
                    rangePosition = "start";
                  } else if (isSameGregorianDay(currentGreg, endDate)) {
                    isSelected = true;
                    rangePosition = "end";
                  } else if (isBetweenGregorianDays(currentGreg, startDate, endDate)) {
                    rangePosition = "in-range";
                  }
                }
              } else {
                isSelected = validSelectedDate ? isSameGregorianDay(validSelectedDate, cellDate) : false;
              }

              return (
                <CalendarDay
                  key={`day-${year}-${month}-${dayNumber}`}
                  dayNumber={dayNumber}
                  year={year}
                  month={month}
                  calendarSystem={calendarSystem}
                  isSelected={isSelected}
                  isToday={isTodayCell}
                  isDisabled={isDisabled}
                  rangePosition={rangePosition}
                  onSelect={onSelectDay}
                  locale={locale}
                  theme={theme}
                  testID={testID}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  },
);
