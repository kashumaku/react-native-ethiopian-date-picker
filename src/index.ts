// UI Components
export {
  EthiopianDatePicker,
  CalendarDay,
  CalendarGrid,
  CalendarHeader,
  WeekdayHeader,
  MonthYearSelector,
  DatePickerModal,
  defaultTheme,
  resolveTheme,
} from "./components";

export type { DayRangePosition } from "./components";

// Calendar Mathematics & Engine
export {
  isEthiopianLeapYear,
  getDaysInEthiopianMonth,
  getEthiopianMonthGrid,
  getEthiopianMonthName,
  getEthiopianMonth,
  getAllEthiopianMonths,
  getEthiopianWeekdayName,
  getEthiopianWeekday,
  getAllEthiopianWeekdays,
  nextEthiopianMonth,
  previousEthiopianMonth,
  isValidEthiopianDate,
  validateEthiopianDate,
  ETHIOPIAN_EPOCH,
  ETHIOPIAN_MONTHS,
  ETHIOPIAN_WEEKDAYS,
} from "./calendar";

// Conversion Engine
export {
  toEthiopian,
  toGregorian,
  gregorianToJdn,
  jdnToGregorian,
  ethiopianToJdn,
  jdnToEthiopian,
  isSameGregorianDay,
  isBeforeGregorianDay,
  isAfterGregorianDay,
  isSameOrBeforeGregorianDay,
  isSameOrAfterGregorianDay,
  isBetweenGregorianDays,
  isToday,
  isSameEthiopianDay,
} from "./conversion";

// Formatting
export { formatEthiopianDate, formatEthiopianDateRange } from "./formatting";

// Localization
export { getLocalization, en, am } from "./localization";

// Hooks
export { useEthiopianDatePicker } from "./hooks/useEthiopianDatePicker";

// Types
export type {
  EthiopianDate,
  EthiopianDateRange,
  EthiopianMonth,
  EthiopianWeekday,
  EthiopianLocale,
  EthiopianDatePickerProps,
  EthiopianDatePickerTheme,
  EthiopianDatePickerRef,
  FormatEthiopianDateOptions,
} from "./types";
