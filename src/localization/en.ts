import type { EthiopianLocale } from "../types";

export interface LocalizationStrings {
  locale: EthiopianLocale;
  today: string;
  cancel: string;
  confirm: string;
  selectDate: string;
  selectRange: string;
  startDate: string;
  endDate: string;
  year: string;
  month: string;
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  months: string[];
  shortMonths: string[];
  weekdays: string[];
  shortWeekdays: string[];
}

export const en: LocalizationStrings = {
  locale: "en",
  today: "Today",
  cancel: "Cancel",
  confirm: "Confirm",
  selectDate: "Select Date",
  selectRange: "Select Date Range",
  startDate: "Start Date",
  endDate: "End Date",
  year: "Year",
  month: "Month",
  previousMonth: "Previous Month",
  nextMonth: "Next Month",
  previousYear: "Previous Year",
  nextYear: "Next Year",
  months: [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yekatit",
    "Megabit",
    "Miazia",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehase",
    "Pagumen",
  ],
  shortMonths: [
    "Mes",
    "Tik",
    "Hid",
    "Tah",
    "Tir",
    "Yek",
    "Meg",
    "Mia",
    "Gin",
    "Sen",
    "Ham",
    "Neh",
    "Pag",
  ],
  weekdays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortWeekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
