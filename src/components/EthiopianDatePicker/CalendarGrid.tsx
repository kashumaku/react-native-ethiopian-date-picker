import React, { useMemo } from "react";
import { View } from "react-native";
import { getEthiopianMonthGrid } from "../../calendar/calendarGrid";
import { toEthiopian } from "../../conversion/gregorianToEthiopian";
import { isSameEthiopianDay } from "../../conversion/comparison";
import { CalendarDay } from "./CalendarDay";
import { styles, type ResolvedTheme } from "./styles";
import type { EthiopianLocale, EthiopianDate } from "../../types";

export interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: Date | null;
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
    selectedDate,
    onSelectDay,
    isDayDisabled,
    locale,
    theme,
    testID,
  }) => {
    const gridDays = useMemo(() => getEthiopianMonthGrid(year, month), [year, month]);

    const selectedEthDate = useMemo<EthiopianDate | null>(() => {
      if (!selectedDate || isNaN(selectedDate.getTime())) return null;
      return toEthiopian(selectedDate);
    }, [selectedDate]);

    const todayEthDate = useMemo<EthiopianDate>(() => {
      return toEthiopian(new Date());
    }, []);

    return (
      <View style={styles.grid}>
        {gridDays.map((dayNumber, index) => {
          if (dayNumber === null) {
            return (
              <CalendarDay
                key={`empty-${index}`}
                dayNumber={null}
                year={year}
                month={month}
                isSelected={false}
                isToday={false}
                isDisabled={true}
                onSelect={onSelectDay}
                locale={locale}
                theme={theme}
              />
            );
          }

          const currentDayObj: EthiopianDate = { year, month, day: dayNumber };
          const isSelected = isSameEthiopianDay(selectedEthDate, currentDayObj);
          const isTodayCell = isSameEthiopianDay(todayEthDate, currentDayObj);
          const isDisabled = isDayDisabled(year, month, dayNumber);

          return (
            <CalendarDay
              key={`day-${year}-${month}-${dayNumber}`}
              dayNumber={dayNumber}
              year={year}
              month={month}
              isSelected={isSelected}
              isToday={isTodayCell}
              isDisabled={isDisabled}
              onSelect={onSelectDay}
              locale={locale}
              theme={theme}
              testID={testID}
            />
          );
        })}
      </View>
    );
  },
);
