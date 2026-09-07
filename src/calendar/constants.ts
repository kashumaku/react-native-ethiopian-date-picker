import type { EthiopianMonth, EthiopianWeekday } from "../types";

/**
 * Julian Day Number (JDN) of the Ethiopian calendar epoch (1 Meskerem 1 EC).
 * Corresponding to August 27, 8 AD (Julian proleptic) / August 29, 8 AD (Julian).
 */
export const ETHIOPIAN_EPOCH = 1724221;

/**
 * Metadata for all 13 Ethiopian calendar months.
 */
export const ETHIOPIAN_MONTHS: readonly EthiopianMonth[] = [
  { number: 1, name: "Meskerem", shortName: "Mes", nameAm: "መስከረም", shortNameAm: "መስ" },
  { number: 2, name: "Tikimt", shortName: "Tik", nameAm: "ጥቅምት", shortNameAm: "ጥቅ" },
  { number: 3, name: "Hidar", shortName: "Hid", nameAm: "ኅዳር", shortNameAm: "ኅዳ" },
  { number: 4, name: "Tahsas", shortName: "Tah", nameAm: "ታኅሣሥ", shortNameAm: "ታኅ" },
  { number: 5, name: "Tir", shortName: "Tir", nameAm: "ጥር", shortNameAm: "ጥር" },
  { number: 6, name: "Yekatit", shortName: "Yek", nameAm: "የካቲት", shortNameAm: "የካ" },
  { number: 7, name: "Megabit", shortName: "Meg", nameAm: "መጋቢት", shortNameAm: "መጋ" },
  { number: 8, name: "Miazia", shortName: "Mia", nameAm: "ሚያዝያ", shortNameAm: "ሚያ" },
  { number: 9, name: "Ginbot", shortName: "Gin", nameAm: "ግንቦት", shortNameAm: "ግን" },
  { number: 10, name: "Sene", shortName: "Sen", nameAm: "ሰኔ", shortNameAm: "ሰኔ" },
  { number: 11, name: "Hamle", shortName: "Ham", nameAm: "ሐምሌ", shortNameAm: "ሐም" },
  { number: 12, name: "Nehase", shortName: "Neh", nameAm: "ነሐሴ", shortNameAm: "ነሐ" },
  { number: 13, name: "Pagumen", shortName: "Pag", nameAm: "ጳጉሜን", shortNameAm: "ጳጉ" },
] as const;

/**
 * Weekdays starting with Sunday (index 0).
 */
export const ETHIOPIAN_WEEKDAYS: readonly EthiopianWeekday[] = [
  { number: 0, name: "Sunday", shortName: "Sun", nameAm: "እሑድ", shortNameAm: "እሑ" },
  { number: 1, name: "Monday", shortName: "Mon", nameAm: "ሰኞ", shortNameAm: "ሰኞ" },
  { number: 2, name: "Tuesday", shortName: "Tue", nameAm: "ማክሰኞ", shortNameAm: "ማክ" },
  { number: 3, name: "Wednesday", shortName: "Wed", nameAm: "ረቡዕ", shortNameAm: "ረቡ" },
  { number: 4, name: "Thursday", shortName: "Thu", nameAm: "ሐሙስ", shortNameAm: "ሐሙ" },
  { number: 5, name: "Friday", shortName: "Fri", nameAm: "ዓርብ", shortNameAm: "ዓር" },
  { number: 6, name: "Saturday", shortName: "Sat", nameAm: "ቅዳሜ", shortNameAm: "ቅዳ" },
] as const;
