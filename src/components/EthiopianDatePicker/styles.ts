import { StyleSheet } from "react-native";
import type { EthiopianDatePickerTheme } from "../../types";

export type ResolvedTheme = Required<EthiopianDatePickerTheme>;

export const defaultTheme: ResolvedTheme = {
  primaryColor: "#C7FF00",
  textColor: "#111827",
  mutedTextColor: "#6B7280",
  backgroundColor: "#FFFFFF",
  surfaceColor: "#F3F4F6",
  selectedDayTextColor: "#111827",
  selectedDayBackgroundColor: "#C7FF00",
  todayTextColor: "#111827",
  todayBorderColor: "#C7FF00",
  disabledTextColor: "#D1D5DB",
  disabledBackgroundColor: "transparent",
  borderColor: "#E5E7EB",
  headerTextColor: "#111827",
  weekdayTextColor: "#6B7280",
  confirmButtonColor: "#C7FF00",
  cancelButtonColor: "#6B7280",
  rangeBackgroundColor: "#F7FEE7",
  rangeTextColor: "#365314",
  rangeStartEndBackgroundColor: "#C7FF00",
  rangeStartEndTextColor: "#111827",
  borderRadius: 16,
};

export function resolveTheme(customTheme?: EthiopianDatePickerTheme): ResolvedTheme {
  const primary = customTheme?.primaryColor ?? defaultTheme.primaryColor;
  return {
    ...defaultTheme,
    selectedDayBackgroundColor: primary,
    todayBorderColor: primary,
    confirmButtonColor: primary,
    rangeStartEndBackgroundColor: primary,
    ...customTheme,
  };
}

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },
  modalCalendarContainer: {
    borderWidth: 0,
    padding: 0,
    maxWidth: "100%",
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  navArrow: {
    fontSize: 22,
    fontWeight: "600",
  },
  weekdayContainer: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
    width: "100%",
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    width: "100%",
  },
  weekRow: {
    flexDirection: "row",
    width: "100%",
  },
  dayCellWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    position: "relative",
  },
  rangeBackgroundStart: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: "50%",
    right: 0,
  },
  rangeBackgroundEnd: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 0,
    right: "50%",
  },
  rangeBackgroundMiddle: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 0,
    right: 0,
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  dayText: {
    fontSize: 15,
    fontWeight: "500",
  },
  selectedDayText: {
    fontWeight: "700",
  },
  todayDayButton: {
    borderWidth: 1.5,
  },
  todayDayText: {
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  todayButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectorContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthButton: {
    width: "31%",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 4,
  },
  monthButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  yearControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  yearText: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
