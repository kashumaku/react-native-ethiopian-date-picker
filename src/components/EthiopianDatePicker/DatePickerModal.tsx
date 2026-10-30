import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { getLocalization } from "../../localization";
import { styles, type ResolvedTheme } from "./styles";
import type { EthiopianLocale } from "../../types";

export interface DatePickerModalProps {
  visible: boolean;
  presentationMode?: "modal" | "sheet";
  selectionType?: "single" | "range";
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  showTodayButton?: boolean;
  todayButtonText?: string;
  onToday?: () => void;
  disabled?: boolean;
  locale: EthiopianLocale;
  theme: ResolvedTheme;
  children: React.ReactNode;
  testID?: string;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  presentationMode = "modal",
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText,
  showTodayButton = false,
  todayButtonText,
  onToday,
  disabled = false,
  locale,
  theme,
  children,
  testID,
}) => {
  const isSheet = presentationMode === "sheet";
  const dict = getLocalization(locale);
  const displayConfirm = confirmText ?? dict.confirm;
  const displayCancel = cancelText ?? dict.cancel;
  const displayToday = todayButtonText ?? dict.today;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={onClose}
      testID={testID ? `${testID}-modal` : undefined}
    >
      <View style={isSheet ? styles.sheetOverlay : styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          testID={testID ? `${testID}-backdrop` : undefined}
          accessibilityRole="button"
          accessibilityLabel={displayCancel}
        />
        <View
          style={[
            isSheet ? styles.sheetContent : styles.modalContent,
            { backgroundColor: theme.backgroundColor },
          ]}
        >
          {isSheet && (
            <View
              style={[styles.sheetHandle, { backgroundColor: theme.borderColor }]}
              testID={testID ? `${testID}-sheet-handle` : undefined}
            />
          )}

          {title !== undefined && title !== "" && (
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.headerTextColor }]}>
                {title}
              </Text>
            </View>
          )}

          {children}

          <View
            style={[
              styles.modalActions,
              { borderTopColor: theme.borderColor },
            ]}
          >
            {showTodayButton && (
              <Pressable
                testID={testID ? `${testID}-today-btn` : undefined}
                accessibilityRole="button"
                accessibilityLabel={displayToday}
                disabled={disabled}
                onPress={onToday}
                style={[styles.todayButton, { marginRight: "auto" }]}
              >
                <Text style={[styles.todayButtonText, { color: theme.todayButtonTextColor }]}>
                  {displayToday}
                </Text>
              </Pressable>
            )}
            <Pressable
              testID={testID ? `${testID}-cancel-btn` : undefined}
              accessibilityRole="button"
              accessibilityLabel={displayCancel}
              onPress={onClose}
              style={[styles.modalButton, { backgroundColor: theme.surfaceColor }]}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: theme.cancelButtonColor },
                ]}
              >
                {displayCancel}
              </Text>
            </Pressable>

            <Pressable
              testID={testID ? `${testID}-confirm-btn` : undefined}
              accessibilityRole="button"
              accessibilityLabel={displayConfirm}
              onPress={onConfirm}
              style={[
                styles.modalButton,
                { backgroundColor: theme.confirmButtonColor },
              ]}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: theme.selectedDayTextColor },
                ]}
              >
                {displayConfirm}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
