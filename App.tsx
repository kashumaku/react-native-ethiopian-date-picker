import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import {
  EthiopianDatePicker,
  EthiopianTimePicker,
  formatEthiopianDate,
  formatEthiopianDateRange,
  formatEthiopianTime,
  type EthiopianDateRange,
  type EthiopianLocale,
  type EthiopianTime,
} from "./src";

type Mode = "sheet" | "modal" | "inline";
type PickerType = "grad" | "exp" | "startTime" | null;

const darkTheme = {
  backgroundColor: "#18181B",
  surfaceColor: "#27272A",
  textColor: "#FAFAFA",
  mutedTextColor: "#A1A1AA",
  headerTextColor: "#FAFAFA",
  weekdayTextColor: "#A1A1AA",
  primaryColor: "#01848a",
  selectedDayBackgroundColor: "#01848a",
  selectedDayTextColor: "#FFFFFF",
  rangeBackgroundColor: "#013B3E",
  rangeTextColor: "#73DFE3",
  rangeStartEndBackgroundColor: "#01848a",
  rangeStartEndTextColor: "#FFFFFF",
  todayTextColor: "#01848a",
  todayBorderColor: "#01848a",
  todayButtonTextColor: "#01848a",
  disabledTextColor: "#52525B",
  disabledBackgroundColor: "transparent",
  borderColor: "#27272A",
  borderRadius: 16,
};

export default function App() {
  const [mode, setMode] = useState<Mode>("modal");
  const [locale, setLocale] = useState<EthiopianLocale>("am");
  const [calendarSystem, setCalendarSystem] = useState<"EC" | "GC">("EC");
  const [isDark, setIsDark] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerType>(null);

  // Form Fields
  const [gradDate, setGradDate] = useState<Date | null>(null);
  const [expRange, setExpRange] = useState<EthiopianDateRange>({
    startDate: null,
    endDate: null,
  });
  const [startTime, setStartTime] = useState<EthiopianTime | null>(null);

  const isAm = locale === "am";
  const gradText = gradDate ? formatEthiopianDate(gradDate, { locale, format: "long" }) : "";
  const expText = formatEthiopianDateRange(expRange, { locale }) || "";
  const startTimeText = startTime ? formatEthiopianTime(startTime, { locale }) : "";

  const themeConfig = isDark ? darkTheme : undefined;
  const bgColor = isDark ? "#09090B" : "#FFFFFF";
  const textColor = isDark ? "#FAFAFA" : "#09090B";
  const mutedColor = isDark ? "#A1A1AA" : "#71717A";
  const borderLineColor = isDark ? "#27272A" : "#E4E4E7";
  const renderCalendarToggle = () => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={calendarSystem === "GC" ? "Gregorian calendar" : "Ethiopian calendar"}
      accessibilityHint="Switch calendar system"
      onPress={() => setCalendarSystem(calendarSystem === "GC" ? "EC" : "GC")}
      style={styles.calendarToggleButton}
    >
      <Text style={[styles.actionBtnText, { color: "#01848a" }]}>{calendarSystem}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: 35, backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Screen Navigation Header */}
      <View style={[styles.navHeader, { backgroundColor: bgColor, borderBottomColor: isDark ? "#18181B" : "#F4F4F5" }]}>
        <Pressable style={styles.navIconBtn}>
          <Text style={[styles.navIcon, { color: textColor }]}>‹</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: textColor }]}>Demo</Text>
        
        {/* Header Right Actions: Locale and Theme Switchers */}
        <View style={styles.navActions}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: isDark ? "#27272A" : "#F4F4F5" }]}
            onPress={() => setLocale(locale === "am" ? "en" : "am")}
          >
            <Text style={[styles.actionBtnText, { color: textColor }]}>
              {locale === "am" ? "EN" : "አማ"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, { backgroundColor: isDark ? "#27272A" : "#F4F4F5" }]}
            onPress={() => setIsDark(!isDark)}
          >
            <Text style={[styles.actionBtnText, { color: textColor }]}>
              {isDark ? "☀️" : "🌙"}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Date picker */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: mutedColor }]}>Pick Date</Text>
          <View style={[styles.underlineInput, { borderBottomColor: borderLineColor }, activePicker === "grad" && styles.underlineInputActive]}>
            <Text style={styles.leadingFieldIcon}>🎓</Text>
            <Pressable style={styles.inputValue} onPress={() => setActivePicker("grad")}>
              <Text style={[styles.inputText, { color: textColor }, !gradDate && styles.placeholderText]}>
                  {gradText || "DD/MM/YYYY"}
              </Text>
            </Pressable>
            {renderCalendarToggle()}
          </View>
        </View>

        {/* Date range picker */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: mutedColor }]}>Pick Date Range</Text>
          <View style={[styles.underlineInput, { borderBottomColor: borderLineColor }, activePicker === "exp" && styles.underlineInputActive]}>
            <Text style={styles.leadingFieldIcon}>💼</Text>
            <Pressable style={styles.inputValue} onPress={() => setActivePicker("exp")}>
              <Text style={[styles.inputText, { color: textColor }, !expRange.startDate && styles.placeholderText]}>
                  {expText || "DD/MM/YYYY - DD/MM/YYYY"}
              </Text>
            </Pressable>
            {renderCalendarToggle()}
          </View>
        </View>

        {/* Time picker */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: mutedColor }]}>Pick Time</Text>
          <Pressable
            style={[
              styles.underlineInput,
              { borderBottomColor: borderLineColor },
              activePicker === "startTime" && styles.underlineInputActive,
            ]}
            onPress={() => setActivePicker("startTime")}
          >
            <Text style={styles.leadingFieldIcon}>⏰</Text>
            <Text style={[styles.inputText, { color: textColor }, !startTime && styles.placeholderText]}>
              {startTimeText || "HH:MM AM"}
            </Text>
          </Pressable>
        </View>

        {/* Inline Picker View (when inline mode active) */}
        {mode === "inline" && activePicker && (
          <View style={styles.inlineBox}>
            <Text style={[styles.inlineTitle, { color: textColor }]}>
              {activePicker === "grad" ? "Pick Date" : activePicker === "exp" ? "Pick Date Range" : "Pick Time"}
            </Text>
            {activePicker === "startTime" ? (
              <EthiopianTimePicker
                mode="inline"
                value={startTime ?? undefined}
                locale={locale}
                theme={themeConfig}
                onChange={(t) => setStartTime(t)}
              />
            ) : (
              <EthiopianDatePicker
                mode="inline"
                selectionType={activePicker === "exp" ? "range" : "single"}
                value={gradDate}
                selectedRange={expRange}
                locale={locale}
                calendarSystem={calendarSystem}
                onCalendarSystemChange={setCalendarSystem}
                theme={themeConfig}
                showTodayButton
                onChange={(d) => setGradDate(d)}
                onRangeChange={(r) => setExpRange(r)}
              />
            )}
          </View>
        )}

        {/* Modal / Sheet Overlay Date Picker */}
        {mode !== "inline" && (activePicker === "grad" || activePicker === "exp") && (
          <EthiopianDatePicker
            mode={mode}
            visible={true}
            selectionType={activePicker === "exp" ? "range" : "single"}
            value={gradDate}
            selectedRange={expRange}
            locale={locale}
            calendarSystem={calendarSystem}
            onCalendarSystemChange={setCalendarSystem}
            theme={themeConfig}
            showTodayButton
            confirmText={isAm ? "አረጋግጥ" : "Confirm"}
            cancelText={isAm ? "ይቅር" : "Cancel"}
            onChange={(d) => {
              setGradDate(d);
              setActivePicker(null);
            }}
            onRangeChange={(r) => {
              setExpRange(r);
              if (r.startDate && r.endDate) setActivePicker(null);
            }}
            onClose={() => setActivePicker(null)}
          />
        )}

        {/* Modal / Sheet Overlay Time Picker */}
        {mode !== "inline" && activePicker === "startTime" && (
          <EthiopianTimePicker
            mode={mode}
            visible={true}
            value={startTime ?? undefined}
            locale={locale}
            theme={themeConfig}
           
            confirmText={isAm ? "አረጋግጥ" : "Confirm"}
            cancelText={isAm ? "ይቅር" : "Cancel"}
            onChange={(t) => {
              setStartTime(t);
              setActivePicker(null);
            }}
            onClose={() => setActivePicker(null)}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    backgroundColor: "#FFFFFF",
  },
  navIconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  navIcon: {
    fontSize: 32,
    fontWeight: "300",
    color: "#09090B",
    marginTop: -4,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#09090B",
    letterSpacing: -0.3,
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  calendarToggleButton: {
    minWidth: 34,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  scroll: { padding: 24, maxWidth: 460, width: "100%", alignSelf: "center" },
  title: { fontSize: 26, fontWeight: "800", color: "#09090B", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: "#71717A", marginTop: 4, marginBottom: 28 },
  fieldGroup: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: "700", color: "#71717A", letterSpacing: 0.6, marginBottom: 8 },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  col: {
    flex: 1,
  },
  underlineInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#E4E4E7",
    paddingVertical: 12,
    fontSize: 17,
    fontWeight: "600",
    color: "#09090B",
  },
  inputValue: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  underlineInputActive: {
    borderBottomColor: "#01848a",
  },
  inputText: { fontSize: 16, fontWeight: "600", color: "#09090B", flex: 1 },
  placeholderText: { color: "#A1A1AA", fontWeight: "400" },
  fieldIcon: { fontSize: 18, marginLeft: 8 },
  leadingFieldIcon: { fontSize: 18, marginRight: 8 },
  inlineBox: { marginTop: 12, alignItems: "center" },
  inlineTitle: { fontSize: 14, fontWeight: "700", color: "#09090B", marginBottom: 12 },
});
