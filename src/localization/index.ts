import { en, type LocalizationStrings } from "./en";
import { am } from "./am";
import type { EthiopianLocale } from "../types";

export { en, am, type LocalizationStrings };

/**
 * Returns the localized dictionary for a given locale code.
 */
export function getLocalization(locale: EthiopianLocale = "en"): LocalizationStrings {
  return locale === "am" ? am : en;
}
