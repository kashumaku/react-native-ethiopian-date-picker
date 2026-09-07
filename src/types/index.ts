import type { ViewStyle } from "react-native";

/**
 * Represents a specific day in the Ethiopian calendar.
 */
export type EthiopianDate = {
  year: number;
  month: number; // 1 to 13
  day: number; // 1 to 30 (or 1 to 5/6 for Pagumen)
};

/**
 * Represents a selected Gregorian date range.
 */
export type EthiopianDateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

/**
 * Metadata for an Ethiopian calendar month.
 */
export type EthiopianMonth = {
  number: number;
  name: string;
  shortName: string;
  nameAm: string;
  shortNameAm: string;
};

/**
 * Metadata for a weekday.
 */
export type EthiopianWeekday = {
  number: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  name: string;
  shortName: string;
  nameAm: string;
  shortNameAm: string;
};

/**
 * Supported localization codes.
 */
export type EthiopianLocale = "en" | "am";

/**
 * Custom color and styling theme for the EthiopianDatePicker component.
 */
export type EthiopianDatePickerTheme = {
  primaryColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  selectedDayTextColor?: string;
  selectedDayBackgroundColor?: string;
  todayTextColor?: string;
  todayBorderColor?: string;
  disabledTextColor?: string;
  disabledBackgroundColor?: string;
  borderColor?: string;
  headerTextColor?: string;
  weekdayTextColor?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  rangeBackgroundColor?: string;
  rangeTextColor?: string;
  rangeStartEndBackgroundColor?: string;
  rangeStartEndTextColor?: string;
  borderRadius?: number;
};

/**
 * Formatting options for formatEthiopianDate utility.
 */
export type FormatEthiopianDateOptions = {
  locale?: EthiopianLocale;
  format?: "short" | "medium" | "long" | "full";
  pattern?: string;
};

/**
 * Props for the EthiopianDatePicker React Native component.
 */
export type EthiopianDatePickerProps = {
  /**
   * Selection type: "single" for picking one date; "range" for picking start and end dates.
   * Default is "single".
   */
  selectionType?: "single" | "range";

  /**
   * The selected Gregorian date (controlled mode when selectionType="single").
   */
  value?: Date | null;

  /**
   * Initial Gregorian date (uncontrolled mode when selectionType="single").
   */
  defaultValue?: Date | null;

  /**
   * Callback fired when a date is selected and confirmed in single mode.
   * Returns a standard JavaScript Date representing local midnight of the selected Ethiopian calendar day.
   */
  onChange?: (date: Date) => void;

  /**
   * The selected Gregorian date range (controlled mode when selectionType="range").
   */
  selectedRange?: EthiopianDateRange | null;

  /**
   * Initial Gregorian date range (uncontrolled mode when selectionType="range").
   */
  defaultSelectedRange?: EthiopianDateRange | null;

  /**
   * Callback fired when a date range is selected (and confirmed in modal mode).
   */
  onRangeChange?: (range: EthiopianDateRange) => void;

  /**
   * Display locale ("en" or "am"). Default is "en".
   */
  locale?: EthiopianLocale;

  /**
   * Presentation mode: "inline" displays embedded calendar; "modal" displays in a popup dialog.
   * Default is "inline".
   */
  mode?: "inline" | "modal";

  /**
   * Minimum selectable Gregorian date.
   */
  minimumDate?: Date;

  /**
   * Maximum selectable Gregorian date.
   */
  maximumDate?: Date;

  /**
   * Specific dates to disable or a predicate function receiving Gregorian Date.
   */
  disabledDates?: Date[] | ((date: Date) => boolean);

  /**
   * Initial visibility for modal mode when uncontrolled. Default is false.
   */
  defaultVisible?: boolean;

  /**
   * Controls modal visibility when mode="modal".
   */
  visible?: boolean;

  /**
   * Callback triggered when modal opens.
   */
  onOpen?: () => void;

  /**
   * Callback triggered when modal closes or cancel is clicked.
   */
  onClose?: () => void;

  /**
   * Whether to show the "Today" shortcut button. Default is false.
   */
  showTodayButton?: boolean;

  /**
   * Custom label for the Today button.
   */
  todayButtonText?: string;

  /**
   * Modal title string.
   */
  title?: string;

  /**
   * Confirm button text for modal mode.
   */
  confirmText?: string;

  /**
   * Cancel button text for modal mode.
   */
  cancelText?: string;

  /**
   * Whether the entire date picker is disabled.
   */
  disabled?: boolean;

  /**
   * Custom outer container style.
   */
  style?: ViewStyle;

  /**
   * Theme overrides.
   */
  theme?: EthiopianDatePickerTheme;

  /**
   * Minimum year boundary for year selector.
   */
  minYear?: number;

  /**
   * Maximum year boundary for year selector.
   */
  maxYear?: number;

  /**
   * Optional test ID for automation testing.
   */
  testID?: string;
};

/**
 * Imperative ref handles exposed by EthiopianDatePicker.
 */
export type EthiopianDatePickerRef = {
  open?: () => void;
  close?: () => void;
  goToToday?: () => void;
  goToDate?: (date: Date) => void;
  setRange?: (range: EthiopianDateRange) => void;
};
