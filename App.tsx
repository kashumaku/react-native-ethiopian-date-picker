import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from "react-native";
import {
  EthiopianDatePicker,
  formatEthiopianDate,
  formatEthiopianDateRange,
  type EthiopianDateRange,
  type EthiopianLocale,
} from "./src";

type Mode = "sheet" | "modal" | "inline";
type PickerType = "grad" | "exp" | null;

export default function App() {
  const [mode, setMode] = useState<Mode>("sheet");
  const [locale, setLocale] = useState<EthiopianLocale>("am");
  const [activePicker, setActivePicker] = useState<PickerType>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [gradDate, setGradDate] = useState<Date | null>(null);
  const [expRange, setExpRange] = useState<EthiopianDateRange>({
    startDate: null,
    endDate: null,
  });

  const isAm = locale === "am";
  const gradText = gradDate ? formatEthiopianDate(gradDate, { locale, format: "long" }) : "";
  const expText = formatEthiopianDateRange(expRange, { locale }) || "";

  return (
    <View style={[styles.container,{
      paddingTop:35,
    }]}>
      <StatusBar style="dark" />

      {/* Screen Navigation Header */}
      <View style={styles.navHeader}>
        <Pressable style={styles.navIconBtn}>
          <Text style={styles.navIcon}>‹</Text>
        </Pressable>
        <Text style={styles.navTitle}>Ethio Date Picker</Text>
        <Pressable style={styles.navIconBtn}>
          <Text style={styles.navPlusIcon}>+</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <Text style={styles.title}>{isAm ? "የባለሙያ መረጃ" : "Professional Profile"}</Text>
        <Text style={styles.subtitle}>
          {isAm ? "እባክዎ መረጃዎን በኢትዮጵያ የቀን መቁጠሪያ ያስገቡ" : "Fill out your details using Ethiopian Calendar"}
        </Text>

        {/* 1. Full Name Input (Underline only) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{isAm ? "ሙሉ ስም" : "FULL NAME"}</Text>
          <TextInput
            style={styles.underlineInput}
            value={name}
            onChangeText={setName}
            placeholder={isAm ? "ስምዎን ያስገቡ" : "Enter your full name"}
            placeholderTextColor="#A1A1AA"
          />
        </View>

        {/* 2. Date of Graduation Input (Underline only) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{isAm ? "የምረቃ ቀን" : "DATE OF GRADUATION"}</Text>
          <Pressable
            style={[styles.underlineInput, activePicker === "grad" && styles.underlineInputActive]}
            onPress={() => setActivePicker("grad")}
          >
            <Text style={[styles.inputText, !gradDate && styles.placeholderText]}>
              {gradText || (isAm ? "የምረቃ ቀን ይምረጡ" : "Select graduation date")}
            </Text>
            <Text style={styles.fieldIcon}>🎓</Text>
          </Pressable>
        </View>

        {/* 3. Experience Year Range Input (Underline only) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{isAm ? "የስራ ልምድ ዓመታት ክልል" : "EXPERIENCE YEAR RANGE"}</Text>
          <Pressable
            style={[styles.underlineInput, activePicker === "exp" && styles.underlineInputActive]}
            onPress={() => setActivePicker("exp")}
          >
            <Text style={[styles.inputText, !expRange.startDate && styles.placeholderText]}>
              {expText || (isAm ? "የልምድ ክልል ይምረጡ" : "Select experience range")}
            </Text>
            <Text style={styles.fieldIcon}>💼</Text>
          </Pressable>
        </View>

        {/* Inline Picker View (when inline mode active) */}
        {mode === "inline" && activePicker && (
          <View style={styles.inlineBox}>
            <Text style={styles.inlineTitle}>
              {activePicker === "grad"
                ? isAm ? "የምረቃ ቀን መምረጫ" : "Select Graduation Date"
                : isAm ? "የስራ ልምድ ክልል መምረጫ" : "Select Experience Range"}
            </Text>
            <EthiopianDatePicker
              mode="inline"
              selectionType={activePicker === "exp" ? "range" : "single"}
              value={gradDate}
              selectedRange={expRange}
              locale={locale}
              showTodayButton
              onChange={(d) => setGradDate(d)}
              onRangeChange={(r) => setExpRange(r)}
            />
          </View>
        )}

        {/* Modal / Sheet Overlay Picker */}
        {mode !== "inline" && activePicker && (
          <EthiopianDatePicker
            mode={mode}
            visible={true}
            selectionType={activePicker === "exp" ? "range" : "single"}
            value={gradDate}
            selectedRange={expRange}
            locale={locale}
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
  navPlusIcon: {
    fontSize: 24,
    fontWeight: "400",
    color: "#09090B",
  },
  scroll: { padding: 24, maxWidth: 460, width: "100%", alignSelf: "center" },
  title: { fontSize: 26, fontWeight: "800", color: "#09090B", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: "#71717A", marginTop: 4, marginBottom: 28 },
  fieldGroup: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: "700", color: "#71717A", letterSpacing: 0.6, marginBottom: 8 },
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
  inputText: { fontSize: 17, fontWeight: "600", color: "#09090B", flex: 1 },
  placeholderText: { color: "#A1A1AA", fontWeight: "400" },
  fieldIcon: { fontSize: 18, marginLeft: 8 },
  inlineBox: { marginTop: 12, alignItems: "center" },
  inlineTitle: { fontSize: 14, fontWeight: "700", color: "#09090B", marginBottom: 12 },
});
