# react-native-ethiopian-date-picker

[![npm version](https://img.shields.io/npm/v/react-native-ethiopian-date-picker.svg)](https://www.npmjs.com/package/react-native-ethiopian-date-picker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Expo Ready](https://img.shields.io/badge/Expo-Compatible-green.svg)](https://expo.dev/)

A modern, production-ready, fully accessible Ethiopian calendar date picker for **React Native** and **Expo**. Built with TypeScript, zero external dependencies, robust Julian Day Number (JDN) astronomical mathematics, full Amharic and English localization, rich theming, inline/modal presentation modes, and a headless hook for completely bespoke UI.

---

## Features

- 📅 **Accurate Ethiopian Calendar Math** — Full support for all 13 months (Meskerem through Pagumen), precise leap year handling (Pagumen 5/6 days), and Julian Day Number (JDN) conversions.
- 🔄 **Bidirectional Date Conversion** — Convert effortlessly between standard JavaScript `Date` (Gregorian) and Ethiopian date representations (`{ year, month, day }`).
- ↔️ **Date Range Picker (`selectionType="range"`)** — Seamlessly select start and end date ranges with continuous ribbon highlighting.
- 🌐 **Built-in English & Amharic (አማርኛ)** — Native Amharic script and English month/weekday names, labels, and formats.
- 🎨 **Deeply Customizable Theming** — Seamless light/dark modes, custom color palettes, surface styling, and custom border radiuses.
- 🪟 **Inline & Modal Modes** — Display directly embedded inside your view hierarchy or present as a modal dialog with confirmation workflows.
- 🪝 **Headless Hook (`useEthiopianDatePicker`)** — Complete UI freedom! Use our reactive state engine to build custom layouts, dropdowns, wheel pickers, or custom grids.
- 🚫 **Flexible Date Constraints** — Enforce `minimumDate`, `maximumDate`, disabled date arrays, or dynamic predicate functions `(date: Date) => boolean`.
- 📝 **Date Formatter Utility** — Flexible `formatEthiopianDate` and `formatEthiopianDateRange` with preset formats and custom pattern tokens.
- ♿ **Accessible & Mobile-First** — Built with native accessibility roles, labels, and hit targets optimized for touch screens.
- 🛡️ **Zero Runtime Dependencies & Tree-Shakeable** — Pure React Native and TypeScript. Ships with ESM, CommonJS, and TypeScript declaration maps.

---

## Installation

```bash
# Using npm
npm install react-native-ethiopian-date-picker

# Using yarn
yarn add react-native-ethiopian-date-picker

# Using pnpm
pnpm add react-native-ethiopian-date-picker

# Using Expo
npx expo install react-native-ethiopian-date-picker
```

### Peer Dependencies
Ensure you have `react` (>= 18.0.0) and `react-native` (>= 0.70.0) installed in your project.

---

## Quick Start

### 1. Inline Calendar (Controlled)

```tsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { EthiopianDatePicker, formatEthiopianDate } from "react-native-ethiopian-date-picker";

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Selected: {formatEthiopianDate(selectedDate)}
      </Text>

      <EthiopianDatePicker
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        showTodayButton
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
});
```

---

### 2. Modal Dialog Mode

```tsx
import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import { EthiopianDatePicker, formatEthiopianDate } from "react-native-ethiopian-date-picker";

export default function ModalExample() {
  const [date, setDate] = useState<Date>(new Date());
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 12 }}>
        Selected: {formatEthiopianDate(date, { locale: "am" })}
      </Text>

      <Button title="Open Ethiopian Date Picker" onPress={() => setVisible(true)} />

      <EthiopianDatePicker
        mode="modal"
        visible={visible}
        value={date}
        locale="am"
        title="ቀን ይምረጡ"
        confirmText="አረጋግጥ"
        cancelText="ይቅር"
        onChange={(newDate) => {
          setDate(newDate);
          setVisible(false);
        }}
        onClose={() => setVisible(false)}
      />
    </View>
  );
}
```

---

### 3. Date Range Picker Mode

Set `selectionType="range"` to allow selecting a start date and an end date:

```tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  EthiopianDatePicker,
  formatEthiopianDateRange,
  type EthiopianDateRange,
} from "react-native-ethiopian-date-picker";

export default function RangeExample() {
  const [range, setRange] = useState<EthiopianDateRange>({
    startDate: null,
    endDate: null,
  });

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ textAlign: "center", marginBottom: 12, fontWeight: "600" }}>
        Selected Range: {formatEthiopianDateRange(range, { locale: "am" }) || "None"}
      </Text>

      <EthiopianDatePicker
        selectionType="range"
        selectedRange={range}
        onRangeChange={(newRange) => setRange(newRange)}
        locale="am"
      />
    </View>
  );
}
```

---

### 4. Localized in Amharic (አማርኛ)

Simply pass `locale="am"`:

```tsx
<EthiopianDatePicker
  locale="am"
  value={selectedDate}
  onChange={setSelectedDate}
  showTodayButton
  todayButtonText="ዛሬ"
/>
```

---

## Advanced Usage

### Min/Max Boundaries and Disabling Dates

```tsx
<EthiopianDatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  // Disable dates before today
  minimumDate={new Date()}
  // Disable dates after 1 year from now
  maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
  // Disable Sundays
  disabledDates={(date) => date.getDay() === 0}
/>
```

---

### Custom Theming (Light & Dark Modes)

Pass a custom `theme` object to customize colors and styling:

```tsx
// Dark Theme Example
const darkTheme = {
  backgroundColor: "#1F2937",
  surfaceColor: "#374151",
  textColor: "#F9FAFB",
  mutedTextColor: "#9CA3AF",
  headerTextColor: "#F9FAFB",
  weekdayTextColor: "#9CA3AF",
  primaryColor: "#3B82F6",
  selectedDayBackgroundColor: "#3B82F6",
  selectedDayTextColor: "#FFFFFF",
  todayTextColor: "#60A5FA",
  todayBorderColor: "#3B82F6",
  disabledTextColor: "#4B5563",
  borderColor: "#374151",
  borderRadius: 20,
};

<EthiopianDatePicker
  theme={darkTheme}
  value={selectedDate}
  onChange={setSelectedDate}
/>
```

---

### Imperative Ref API

You can control the picker imperatively using a `ref`:

```tsx
import React, { useRef } from "react";
import { View, Button } from "react-native";
import { EthiopianDatePicker, EthiopianDatePickerRef } from "react-native-ethiopian-date-picker";

export function RefExample() {
  const pickerRef = useRef<EthiopianDatePickerRef>(null);

  return (
    <View>
      <Button title="Jump to Today" onPress={() => pickerRef.current?.goToToday?.()} />
      <Button title="Open Modal" onPress={() => pickerRef.current?.open?.()} />

      <EthiopianDatePicker
        ref={pickerRef}
        mode="modal"
        defaultValue={new Date()}
      />
    </View>
  );
}
```

---

### Date Formatting Utility (`formatEthiopianDate`)

Format any standard JavaScript `Date` or `{ year, month, day }` Ethiopian date object:

```tsx
import { formatEthiopianDate } from "react-native-ethiopian-date-picker";

const date = new Date(2026, 8, 25); // September 25, 2026 -> 15 Meskerem 2019

// Built-in presets
formatEthiopianDate(date); // "15 Meskerem 2019" (medium, default)
formatEthiopianDate(date, { format: "short" }); // "15/01/2019"
formatEthiopianDate(date, { format: "long" }); // "Meskerem 15, 2019"
formatEthiopianDate(date, { format: "full" }); // "Friday, Meskerem 15, 2019"

// Amharic localization
formatEthiopianDate(date, { locale: "am" }); // "15 መስከረም 2019"
formatEthiopianDate(date, { locale: "am", format: "full" }); // "ዓርብ, መስከረም 15, 2019"

// Custom pattern formatting
formatEthiopianDate(date, { pattern: "DD/MM/YYYY" }); // "15/01/2019"
formatEthiopianDate(date, { pattern: "dddd, MMMM D, YYYY" }); // "Friday, Meskerem 15, 2019"
formatEthiopianDate(date, { pattern: "YYYY-MM-DD" }); // "2019-01-15"
```

#### Supported Pattern Tokens

| Token | Output | Example |
| :--- | :--- | :--- |
| `YYYY` | 4-digit Ethiopian year | `2019` |
| `YY` | 2-digit Ethiopian year | `19` |
| `MMMM` | Full Ethiopian month name | `Meskerem` / `መስከረም` |
| `MMM` | Short Ethiopian month name | `Mes` / `መስ` |
| `MM` | 2-digit month index (01–13) | `01` |
| `M` | 1-or-2-digit month index (1–13) | `1` |
| `DD` | 2-digit day of month (01–30) | `15` |
| `D` | 1-or-2-digit day of month (1–30) | `15` |
| `dddd` | Full weekday name | `Friday` / `ዓርብ` |
| `ddd` | Short weekday name | `Fri` / `ዓር` |

---

### Headless Hook (`useEthiopianDatePicker`)

If you need a custom UI layout (e.g. horizontal scroll picker, dropdown menu, custom wheel selector), use the headless hook:

```tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useEthiopianDatePicker, getEthiopianMonthName } from "react-native-ethiopian-date-picker";

export function CustomPicker() {
  const {
    displayedYear,
    displayedMonth,
    selectedDate,
    goToNextMonth,
    goToPreviousMonth,
    selectDay,
    isDayDisabled,
  } = useEthiopianDatePicker({
    defaultValue: new Date(),
    onChange: (d) => console.log("Selected:", d),
  });

  return (
    <View>
      {/* Custom Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text>Prev</Text>
        </TouchableOpacity>
        <Text>
          {getEthiopianMonthName(displayedMonth)} {displayedYear}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Render Custom Day Grid */}
      {/* ... your custom UI */}
    </View>
  );
}
```

---

### Direct Conversion & Calendar Mathematics

Use the underlying arithmetic engine directly in your utilities, state management, or backend sync layers:

```tsx
import {
  toEthiopian,
  toGregorian,
  isEthiopianLeapYear,
  getDaysInEthiopianMonth,
  isValidEthiopianDate,
  getEthiopianMonthGrid,
  getAllEthiopianMonths,
  getAllEthiopianWeekdays,
} from "react-native-ethiopian-date-picker";

// Gregorian Date -> Ethiopian Date
const ethDate = toEthiopian(new Date(2026, 8, 25));
// => { year: 2019, month: 1, day: 15 }

// Ethiopian Date -> JavaScript Date
const gregDate = toGregorian({ year: 2019, month: 1, day: 15 });
// => Date representing local midnight

// Leap Year calculation (Every 4 years, year % 4 === 3 in Ethiopian calendar)
isEthiopianLeapYear(2019); // => true (Pagumen has 6 days)
isEthiopianLeapYear(2018); // => false (Pagumen has 5 days)

// Month Length (Pagumen returns 5 or 6 depending on leap year)
getDaysInEthiopianMonth(2019, 13); // => 6
getDaysInEthiopianMonth(2018, 13); // => 5
getDaysInEthiopianMonth(2019, 1);  // => 30

// Date Validation
isValidEthiopianDate(2019, 13, 6); // => true
isValidEthiopianDate(2018, 13, 6); // => false (not a leap year)

// Calendar Grid Matrix (including leading and trailing empty cells)
const grid = getEthiopianMonthGrid(2019, 1);
```

---

## API Reference

### `<EthiopianDatePicker />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `selectionType` | `"single" \| "range"` | `"single"` | Single date picker or date range selection mode. |
| `value` | `Date \| null` | `undefined` | Controlled Gregorian Date value (when `selectionType="single"`). |
| `defaultValue` | `Date \| null` | `new Date()` | Initial Gregorian Date for uncontrolled single mode. |
| `onChange` | `(date: Date) => void` | `undefined` | Callback fired when a single date is selected. |
| `selectedRange` | `EthiopianDateRange \| null` | `undefined` | Controlled Gregorian date range (when `selectionType="range"`). |
| `defaultSelectedRange` | `EthiopianDateRange \| null` | `{ startDate: null, endDate: null }` | Initial Gregorian date range for uncontrolled range mode. |
| `onRangeChange` | `(range: EthiopianDateRange) => void` | `undefined` | Callback fired when a date range is selected/confirmed. |
| `locale` | `"en" \| "am"` | `"en"` | Language locale for month names, weekdays, and buttons. |
| `mode` | `"inline" \| "modal"` | `"inline"` | Display mode: embedded in page or in a modal popup. |
| `defaultVisible` | `boolean` | `false` | Initial visibility state for modal mode when uncontrolled. |
| `visible` | `boolean` | `undefined` | Controls modal visibility when `mode="modal"`. |
| `onOpen` | `() => void` | `undefined` | Fired when modal opens. |
| `onClose` | `() => void` | `undefined` | Fired when modal closes or is cancelled. |
| `minimumDate` | `Date` | `undefined` | Minimum selectable Gregorian date. |
| `maximumDate` | `Date` | `undefined` | Maximum selectable Gregorian date. |
| `disabledDates` | `Date[] \| ((date: Date) => boolean)` | `undefined` | Specific dates or dynamic predicate to disable. |
| `showTodayButton`| `boolean` | `false` | Whether to display the "Today" shortcut button. |
| `todayButtonText`| `string` | `"Today"` / `"ዛሬ"` | Custom label for the today button. |
| `title` | `string` | `"Select Date"` | Modal header title. |
| `confirmText` | `string` | `"Confirm"` / `"አረጋግጥ"` | Modal confirm button label. |
| `cancelText` | `string` | `"Cancel"` / `"ይቅር"` | Modal cancel button label. |
| `theme` | `EthiopianDatePickerTheme` | `defaultTheme` | Color and styling theme overrides. |
| `minYear` | `number` | `1900` | Minimum year allowed in the month/year selector. |
| `maxYear` | `number` | `2100` | Maximum year allowed in the month/year selector. |
| `disabled` | `boolean` | `false` | Disables interaction across the entire picker. |
| `style` | `ViewStyle` | `undefined` | Style overrides for the outer container. |
| `testID` | `string` | `undefined` | Automation test ID prefix. |

---

### `EthiopianDatePickerTheme`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `primaryColor` | `string` | `"#C7FF00"` | Primary accent color for active items and buttons. |
| `textColor` | `string` | `"#111827"` | Main text color for numbers and headers. |
| `mutedTextColor` | `string` | `"#6B7280"` | Muted text color for secondary labels. |
| `backgroundColor`| `string` | `"#FFFFFF"` | Background color for the calendar container. |
| `surfaceColor` | `string` | `"#F3F4F6"` | Background for buttons and dropdown elements. |
| `selectedDayBackgroundColor` | `string` | `"#C7FF00"` | Background for selected day bubble. |
| `selectedDayTextColor` | `string` | `"#111827"` | Text color for selected day bubble. |
| `rangeBackgroundColor` | `string` | `"#F7FEE7"` | Background for in-between days in a date range. |
| `rangeTextColor` | `string` | `"#365314"` | Text color for in-between days in a date range. |
| `rangeStartEndBackgroundColor` | `string` | `"#C7FF00"` | Background for range start/end days. |
| `rangeStartEndTextColor` | `string` | `"#111827"` | Text color for range start/end days. |
| `todayTextColor` | `string` | `"#111827"` | Text color for current day indicator. |
| `todayBorderColor` | `string` | `"#C7FF00"` | Border color for current day indicator. |
| `disabledTextColor` | `string` | `"#D1D5DB"` | Text color for disabled date cells. |
| `disabledBackgroundColor` | `string` | `"transparent"`| Background for disabled date cells. |
| `borderColor` | `string` | `"#E5E7EB"` | Border color around container and dividers. |
| `headerTextColor` | `string` | `"#111827"` | Text color for month & year header. |
| `weekdayTextColor` | `string` | `"#6B7280"` | Text color for column weekday labels. |
| `confirmButtonColor` | `string` | `"#C7FF00"` | Modal confirmation button color. |
| `cancelButtonColor` | `string` | `"#6B7280"` | Modal cancel button color. |
| `borderRadius` | `number` | `16` | Border radius for container and cells. |

---

## Ethiopian Calendar Overview

The Ethiopian calendar (Ge'ez: የኢትዮጵያ ዘመን አቆጣጠር) is a solar calendar:
- **12 months** of exactly **30 days** each.
- **1 Pagumen** (13th month) of **5 days** (or **6 days** in a leap year).
- **Leap Year**: Occurs every 4 years without exception (when `year % 4 === 3`).
- **New Year (Enkutatash)**: Falls on September 11 (or September 12 in the year preceding a Gregorian leap year).
- **Year Difference**: Approximately 7 to 8 years behind the Gregorian calendar.

### Month Names

| # | English Name | Amharic (አማርኛ) | Days |
| :-: | :--- | :--- | :-: |
| 1 | Meskerem | መስከረም | 30 |
| 2 | Tikimt | ጥቅምት | 30 |
| 3 | Hidar | ኅዳር | 30 |
| 4 | Tahsas | ታኅሣሥ | 30 |
| 5 | Tir | ጥር | 30 |
| 6 | Yekatit | የካቲት | 30 |
| 7 | Megabit | መጋቢት | 30 |
| 8 | Miazia | ሚያዝያ | 30 |
| 9 | Ginbot | ግንቦት | 30 |
| 10 | Sene | ሰኔ | 30 |
| 11 | Hamle | ሐምሌ | 30 |
| 12 | Nehase | ነሐሴ | 30 |
| 13 | Pagumen | ጳጉሜን | 5 or 6 |

---

## Contributing

Contributions, bug reports, and feature suggestions are very welcome!
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
