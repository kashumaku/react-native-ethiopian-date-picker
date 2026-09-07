import React, { useMemo } from "react";
import { View } from "react-native";
import { getEthiopianMonthGrid } from "../../calendar/calendarGrid";
import { toEthiopian } from "../../conversion/gregorianToEthiopian";
import { toGregorian } from "../../conversion/ethiopianToGregorian";
import {
  isSameEthiopianDay,
  isSameGregorianDay,
  isBetweenGregorianDays,
} from "../../conversion/comparison";
import { CalendarDay, type DayRangePosition } from "./CalendarDay";
import { styles, type ResolvedTheme } from "./styles";
import type { EthiopianLocale, EthiopianDate, EthiopianDateRange } from "../../types";

export interface CalendarGridProps {
  year: number;
  month: number;
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
    selectionType = "single",
    selectedDate,
    selectedRange,
    onSelectDay,
    isDayDisabled,
    locale,
    theme,
    testID,
  }) => {
    const gridDays = useMemo(() => getEthiopianMonthGrid(year, month), [year, month]);

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

    const selectedEthDate = useMemo<EthiopianDate | null>(() => {
      if (!selectedDate || isNaN(selectedDate.getTime())) return null;
      return toEthiopian(selectedDate);
    }, [selectedDate]);

    const todayEthDate = useMemo<EthiopianDate>(() => {
      return toEthiopian(new Date());
    }, []);

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

              const currentDayObj: EthiopianDate = { year, month, day: dayNumber };
              const isTodayCell = isSameEthiopianDay(todayEthDate, currentDayObj);
              const isDisabled = isDayDisabled(year, month, dayNumber);

              let isSelected = false;
              let rangePosition: DayRangePosition = "none";

              if (selectionType === "range") {
                const currentGreg = toGregorian(currentDayObj);

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
                isSelected = isSameEthiopianDay(selectedEthDate, currentDayObj);
              }

              return (
                <CalendarDay
                  key={`day-${year}-${month}-${dayNumber}`}
                  dayNumber={dayNumber}
                  year={year}
                  month={month}
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
