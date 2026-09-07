import React, { forwardRef, useImperativeHandle } from "react";
import { View, Text, Pressable } from "react-native";
import { useEthiopianDatePicker } from "../../hooks/useEthiopianDatePicker";
import { getLocalization } from "../../localization";
import { CalendarHeader } from "./CalendarHeader";
import { WeekdayHeader } from "./WeekdayHeader";
import { CalendarGrid } from "./CalendarGrid";
import { MonthYearSelector } from "./MonthYearSelector";
import { DatePickerModal } from "./DatePickerModal";
import { resolveTheme, styles } from "./styles";
import type {
  EthiopianDatePickerProps,
  EthiopianDatePickerRef,
} from "../../types";

export const EthiopianDatePicker = forwardRef<
  EthiopianDatePickerRef,
  EthiopianDatePickerProps
>((props, ref) => {
  const {
    selectionType = "single",
    locale = "en",
    mode = "inline",
    showTodayButton = false,
    todayButtonText,
    title,
    confirmText,
    cancelText,
    disabled = false,
    style,
    theme: customTheme,
    minYear = 1900,
    maxYear = 2100,
    testID,
  } = props;

  const resolvedTheme = resolveTheme(customTheme);
  const dict = getLocalization(locale);

  const {
    selectedDate,
    selectedRange,
    displayedYear,
    displayedMonth,
    isMonthYearSelectorOpen,
    isModalVisible,
    isDayDisabled,
    goToNextMonth,
    goToPreviousMonth,
    setMonthAndYear,
    selectDay,
    goToToday,
    goToDate,
    openModal,
    closeModal,
    confirmDraft,
    cancelDraft,
    setRange,
    toggleMonthYearSelector,
  } = useEthiopianDatePicker(props);

  useImperativeHandle(ref, () => ({
    open: openModal,
    close: closeModal,
    goToToday,
    goToDate,
    setRange,
  }));

  const renderCalendarContent = (isInsideModal = false) => (
    <View
      style={[
        styles.container,
        {
          backgroundColor: resolvedTheme.backgroundColor,
          borderColor: resolvedTheme.borderColor,
          borderRadius: resolvedTheme.borderRadius,
        },
        isInsideModal && styles.modalCalendarContainer,
        style,
      ]}
      testID={testID}
      accessibilityRole="none"
    >
      <CalendarHeader
        year={displayedYear}
        month={displayedMonth}
        locale={locale}
        theme={resolvedTheme}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToggleMonthYearSelector={toggleMonthYearSelector}
        isMonthYearSelectorOpen={isMonthYearSelectorOpen}
        disabled={disabled}
        testID={testID}
      />

      {isMonthYearSelectorOpen ? (
        <MonthYearSelector
          currentYear={displayedYear}
          currentMonth={displayedMonth}
          onSelect={setMonthAndYear}
          locale={locale}
          theme={resolvedTheme}
          minYear={minYear}
          maxYear={maxYear}
          testID={testID}
        />
      ) : (
        <>
          <WeekdayHeader locale={locale} theme={resolvedTheme} />
          <CalendarGrid
            year={displayedYear}
            month={displayedMonth}
            selectionType={selectionType}
            selectedDate={selectedDate}
            selectedRange={selectedRange}
            onSelectDay={selectDay}
            isDayDisabled={isDayDisabled}
            locale={locale}
            theme={resolvedTheme}
            testID={testID}
          />
        </>
      )}

      {showTodayButton && (
        <View
          style={[
            styles.footer,
            { borderTopColor: resolvedTheme.borderColor },
          ]}
        >
          <Pressable
            testID={testID ? `${testID}-today-btn` : undefined}
            accessibilityRole="button"
            accessibilityLabel={todayButtonText ?? dict.today}
            disabled={disabled}
            onPress={goToToday}
            style={[
              styles.todayButton,
              { backgroundColor: resolvedTheme.surfaceColor },
            ]}
          >
            <Text
              style={[
                styles.todayButtonText,
                { color: resolvedTheme.todayButtonTextColor },
              ]}
            >
              {todayButtonText ?? dict.today}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  if (mode === "modal" || mode === "sheet") {
    return (
      <DatePickerModal
        visible={isModalVisible}
        presentationMode={mode}
        selectionType={selectionType}
        onClose={cancelDraft}
        onConfirm={confirmDraft}
        title={title}
        confirmText={confirmText}
        cancelText={cancelText}
        locale={locale}
        theme={resolvedTheme}
        testID={testID}
      >
        {renderCalendarContent(true)}
      </DatePickerModal>
    );
  }

  return renderCalendarContent();
});

EthiopianDatePicker.displayName = "EthiopianDatePicker";
