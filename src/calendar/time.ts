import type { EthiopianTime, EthiopianTimePeriod } from "../types";

/**
 * Converts a Gregorian 24h hour (0-23) to Ethiopian 12-hour solar cycle hour (1-12)
 * and its traditional time period.
 */
export function gregorianToEthiopianTime(hours: number, minutes: number): {
  hours: number;
  minutes: number;
  period: EthiopianTimePeriod;
} {
  const normHours = ((hours % 24) + 24) % 24;
  const ethHour = (normHours + 6) % 12 === 0 ? 12 : (normHours + 6) % 12;

  let period: EthiopianTimePeriod;
  if (normHours >= 6 && normHours < 12) {
    period = "morning";
  } else if (normHours >= 12 && normHours < 18) {
    period = "afternoon";
  } else if (normHours >= 18 && normHours < 24) {
    period = "evening";
  } else {
    period = "night";
  }

  return {
    hours: ethHour,
    minutes,
    period,
  };
}

/**
 * Converts an Ethiopian 12-hour solar cycle hour and period back to Gregorian 24-hour time.
 */
export function ethiopianToGregorianTime(
  hours: number,
  minutes: number,
  period: EthiopianTimePeriod,
): EthiopianTime {
  const h = hours % 12;
  let gregHours: number;

  switch (period) {
    case "morning":
      gregHours = h + 6;
      break;
    case "afternoon":
      gregHours = h + 12;
      break;
    case "evening":
      gregHours = h + 18;
      break;
    case "night":
      gregHours = h;
      break;
  }

  return {
    hours: (gregHours + 24) % 24,
    minutes,
  };
}

/**
 * Returns the localized name for an Ethiopian time period.
 */
export function getTimePeriodName(
  period: EthiopianTimePeriod,
  locale: "en" | "am" = "en",
): string {
  const PERIODS: Record<EthiopianTimePeriod, { en: string; am: string }> = {
    morning: { en: "Morning", am: "ጠዋት" },
    afternoon: { en: "Afternoon", am: "ከሰዓት" },
    evening: { en: "Evening", am: "ማታ" },
    night: { en: "Night", am: "ሌሊት" },
  };

  return PERIODS[period]?.[locale] ?? period;
}
