export interface EthiopianDate {
  year: number
  month: number
  day: number
}

const ETHIOPIAN_EPOCH = 1724221

export function isEthiopianLeapYear(
  year: number,
): boolean {
  return year % 4 === 3
}

export function isValidEthiopianDate(
  year: number,
  month: number,
  day: number,
): boolean {
  if (!Number.isInteger(year) || year < 1) {
    return false
  }

  if (!Number.isInteger(month) || month < 1 || month > 13) {
    return false
  }

  if (!Number.isInteger(day) || day < 1) {
    return false
  }

  const maxDay =
    month === 13
      ? isEthiopianLeapYear(year)
        ? 6
        : 5
      : 30

  return day <= maxDay
}

function ethiopianToJdn(
  year: number,
  month: number,
  day: number,
): number {
  if (!isValidEthiopianDate(year, month, day)) {
    throw new Error(
      `Invalid Ethiopian date: ${year}-${month}-${day}`,
    )
  }

  return (
    ETHIOPIAN_EPOCH -
    1 +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * (month - 1) +
    day
  )
}

function jdnToEthiopian(
  jdn: number,
): EthiopianDate {
  const r = jdn - ETHIOPIAN_EPOCH

  const year = Math.floor(
    (4 * r + 1463) / 1461,
  )

  const month =
    1 +
    Math.floor(
      (r -
        (365 * (year - 1) +
          Math.floor(year / 4))) /
        30,
    )

  const day =
    jdn -
    ethiopianToJdn(year, month, 1) +
    1

  return {
    year,
    month,
    day,
  }
}

function gregorianToJdn(
  date: Date,
): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

function jdnToGregorian(
  jdn: number,
): Date {
  const a = jdn + 32044
  const b = Math.floor(
    (4 * a + 3) / 146097,
  )
  const c =
    a -
    Math.floor((146097 * b) / 4)

  const d = Math.floor(
    (4 * c + 3) / 1461,
  )

  const e =
    c -
    Math.floor((1461 * d) / 4)

  const m = Math.floor(
    (5 * e + 2) / 153,
  )

  const day =
    e -
    Math.floor((153 * m + 2) / 5) +
    1

  const month =
    m +
    3 -
    12 * Math.floor(m / 10)

  const year =
    100 * b +
    d -
    4800 +
    Math.floor(m / 10)

  return new Date(
    year,
    month - 1,
    day,
  )
}

export function gregorianToEthiopian(
  date: Date = new Date(),
): EthiopianDate {
  return jdnToEthiopian(
    gregorianToJdn(date),
  )
}

export function ethiopianToGregorian(
  year: number,
  month: number,
  day: number,
): Date {
  return jdnToGregorian(
    ethiopianToJdn(
      year,
      month,
      day,
    ),
  )
}

export function todayEthiopian(): EthiopianDate {
  return gregorianToEthiopian(
    new Date(),
  )
}