import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from "react-native";
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
type PickerType = "grad" | "exp" | "startTime" | "endTime" | null;

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
  const [isDark, setIsDark] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerType>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [gradDate, setGradDate] = useState<Date | null>(null);
  const [expRange, setExpRange] = useState<EthiopianDateRange>({
    startDate: null,
    endDate: null,
  });
  const [startTime, setStartTime] = useState<EthiopianTime | null>(null);
  const [endTime, setEndTime] = useState<EthiopianTime | null>(null);

  const isAm = locale === "am";
  const gradText = gradDate ? formatEthiopianDate(gradDate, { locale, format: "long" }) : "";
  const expText = formatEthiopianDateRange(expRange, { locale }) || "";
  const startTimeText = startTime ? formatEthiopianTime(startTime, { locale }) : "";
  const endTimeText = endTime ? formatEthiopianTime(endTime, { locale }) : "";

  const themeConfig = isDark ? darkTheme : undefined;
  const bgColor = isDark ? "#09090B" : "#FFFFFF";
  const textColor = isDark ? "#FAFAFA" : "#09090B";
  const mutedColor = isDark ? "#A1A1AA" : "#71717A";
  const borderLineColor = isDark ? "#27272A" : "#E4E4E7";

  return (
    <View style={[styles.container, { paddingTop: 35, backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Screen Navigation Header */}
      <View style={[styles.navHeader, { backgroundColor: bgColor, borderBottomColor: isDark ? "#18181B" : "#F4F4F5" }]}>
        <Pressable style={styles.navIconBtn}>
          <Text style={[styles.navIcon, { color: textColor }]}>‹</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: textColor }]}>Ethio Date Picker</Text>
        
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
        {/* Title */}
        <Text style={[styles.title, { color: textColor }]}>{isAm ? "የባለሙያ መረጃ" : "Professional Profile"}</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          {isAm ? "እባክዎ መረጃዎን በኢትዮጵያ የቀንና የሰዓት መቁጠሪያ ያስገቡ" : "Fill out your details using Ethiopian Calendar & Time"}
        </Text>

        {/* 1. Full Name Input (Underline only) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: mutedColor }]}>{isAm ? "ሙሉ ስም" : "FULL NAME"}</Text>
          <TextInput
            style={[styles.underlineInput, { color: textColor, borderBottomColor: borderLineColor }]}
            value={name}
            onChangeText={setName}
            placeholder={isAm ? "ስምዎን ያስገቡ" : "Enter your full name"}
            placeholderTextColor={isDark ? "#71717A" : "#A1A1AA"}
          />
        </View>

        {/* 2. Date of Graduation Input (Underline only) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: mutedColor }]}>{isAm ? "የምረቃ ቀን" : "DATE OF GRADUATION"}</Text>
          <Pressable
            style={[
              styles.underlineInput,
              { borderBottomColor: borderLineColor },
              activePicker === "grad" && styles.underlineInputActive,
            ]}
            onPress={() => setActivePicker("grad")}
          >
            <Text style={[styles.inputText, { color: textColor }, !gradDate && styles.placeholderText]}>
              {gradText || (isAm ? "የምረቃ ቀን ይምረጡ" : "Select graduation date")}
            </Text>
            <Text style={styles.fieldIcon}>🎓</Text>
          </Pressable>
        </View>

        {/* 3. Experience Year Range Input (Underline only) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: mutedColor }]}>{isAm ? "የስራ ልምድ ዓመታት ክልል" : "EXPERIENCE YEAR RANGE"}</Text>
          <Pressable
            style={[
              styles.underlineInput,
              { borderBottomColor: borderLineColor },
              activePicker === "exp" && styles.underlineInputActive,
            ]}
            onPress={() => setActivePicker("exp")}
          >
            <Text style={[styles.inputText, { color: textColor }, !expRange.startDate && styles.placeholderText]}>
              {expText || (isAm ? "የልምድ ክልል ይምረጡ" : "Select experience range")}
            </Text>
            <Text style={styles.fieldIcon}>💼</Text>
          </Pressable>
        </View>

        {/* 4. Working Hours in a Row (Start & End Time) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: mutedColor }]}>{isAm ? "የስራ ሰዓት (መግቢያ - መውጫ)" : "WORKING HOURS (START & END)"}</Text>
          <View style={styles.row}>
            {/* Start Time */}
            <View style={styles.col}>
              <Pressable
                style={[
                  styles.underlineInput,
                  { borderBottomColor: borderLineColor },
                  activePicker === "startTime" && styles.underlineInputActive,
                ]}
                onPress={() => setActivePicker("startTime")}
              >
                <Text style={[styles.inputText, { color: textColor }, !startTime && styles.placeholderText]}>
                  {startTimeText || (isAm ? "መግቢያ ሰዓት" : "Start Time")}
                </Text>
                <Text style={styles.fieldIcon}>⏰</Text>
              </Pressable>
            </View>

            {/* End Time */}
            <View style={styles.col}>
              <Pressable
                style={[
                  styles.underlineInput,
                  { borderBottomColor: borderLineColor },
                  activePicker === "endTime" && styles.underlineInputActive,
                ]}
                onPress={() => setActivePicker("endTime")}
              >
                <Text style={[styles.inputText, { color: textColor }, !endTime && styles.placeholderText]}>
                  {endTimeText || (isAm ? "መውጫ ሰዓት" : "End Time")}
                </Text>
                <Text style={styles.fieldIcon}>⏰</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Inline Picker View (when inline mode active) */}
        {mode === "inline" && activePicker && (
          <View style={styles.inlineBox}>
            <Text style={[styles.inlineTitle, { color: textColor }]}>
              {activePicker === "grad"
                ? isAm ? "የምረቃ ቀን መምረጫ" : "Select Graduation Date"
                : activePicker === "exp"
                ? isAm ? "የስራ ልምድ ክልል መምረጫ" : "Select Experience Range"
                : activePicker === "startTime"
                ? isAm ? "የስራ መግቢያ ሰዓት መምረጫ" : "Select Start Working Time"
                : isAm ? "የስራ መውጫ ሰዓት መምረጫ" : "Select End Working Time"}
            </Text>
            {activePicker === "startTime" ? (
              <EthiopianTimePicker
                mode="inline"
                value={startTime ?? undefined}
                locale={locale}
                theme={themeConfig}
                onChange={(t) => setStartTime(t)}
              />
            ) : activePicker === "endTime" ? (
              <EthiopianTimePicker
                mode="inline"
                value={endTime ?? undefined}
                locale={locale}
                theme={themeConfig}
                onChange={(t) => setEndTime(t)}
              />
            ) : (
              <EthiopianDatePicker
                mode="inline"
                selectionType={activePicker === "exp" ? "range" : "single"}
                value={gradDate}
                selectedRange={expRange}
                locale={locale}
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
            theme={themeConfig}
            showTodayButton
            title={
              activePicker === "grad"
                ? isAm ? "የምረቃ ቀን ይምረጡ" : "Select Date of Graduation"
                : isAm ? "የስራ ልምድ ክልል ይምረጡ" : "Select Experience Range"
            }
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
        {mode !== "inline" && (activePicker === "startTime" || activePicker === "endTime") && (
          <EthiopianTimePicker
            mode={mode}
            visible={true}
            value={
              activePicker === "startTime"
                ? startTime ?? undefined
                : endTime ?? undefined
            }
            locale={locale}
            theme={themeConfig}
            title={
              activePicker === "startTime"
                ? isAm ? "የስራ መግቢያ ሰዓት ይምረጡ" : "Select Start Working Time"
                : isAm ? "የስራ መውጫ ሰዓት ይምረጡ" : "Select End Working Time"
            }
            confirmText={isAm ? "አረጋግጥ" : "Confirm"}
            cancelText={isAm ? "ይቅር" : "Cancel"}
            onChange={(t) => {
              if (activePicker === "startTime") {
                setStartTime(t);
              } else {
                setEndTime(t);
              }
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
  underlineInputActive: {
    borderBottomColor: "#01848a",
  },
  inputText: { fontSize: 16, fontWeight: "600", color: "#09090B", flex: 1 },
  placeholderText: { color: "#A1A1AA", fontWeight: "400" },
  fieldIcon: { fontSize: 18, marginLeft: 8 },
  inlineBox: { marginTop: 12, alignItems: "center" },
  inlineTitle: { fontSize: 14, fontWeight: "700", color: "#09090B", marginBottom: 12 },
});
