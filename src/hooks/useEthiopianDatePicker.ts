import { useState, useEffect, useCallback, useMemo } from "react";
import { toEthiopian } from "../conversion/gregorianToEthiopian";
import { toGregorian } from "../conversion/ethiopianToGregorian";
import {
  isSameGregorianDay,
  isBeforeGregorianDay,
  isAfterGregorianDay,
} from "../conversion/comparison";
import { nextEthiopianMonth, previousEthiopianMonth } from "../calendar/month";
import { createGregorianDate, nextGregorianMonth, previousGregorianMonth } from "../calendar/gregorian";
import type {
  EthiopianDatePickerProps,
  EthiopianDateRange,
  CalendarSystem,
  CalendarType,
} from "../types";

function normalizeCalendarSystem(system: CalendarSystem | undefined): CalendarType {
  return system === "GC" || system === "gregorian" ? "gregorian" : "ethiopian";
}

export function useEthiopianDatePicker(props: EthiopianDatePickerProps) {
  const {
    selectionType = "single",
    value,
    defaultValue,
    onChange,
    selectedRange,
    defaultSelectedRange,
    onRangeChange,
    minimumDate,
    maximumDate,
    disabledDates,
    mode = "inline",
    defaultVisible = false,
    visible: controlledVisible,
    onOpen,
    onClose,
    minYear = 1900,
    maxYear = 2100,
  } = props;
  const [internalCalendarSystem, setInternalCalendarSystem] = useState<CalendarSystem>(
    props.calendarSystem ?? "EC",
  );
  const calendarSystem: CalendarType = normalizeCalendarSystem(props.calendarSystem ?? internalCalendarSystem);
  const dateToDisplay = useCallback((date: Date) => {
    if (calendarSystem === "ethiopian") return toEthiopian(date);
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }, [calendarSystem]);

  // Single date mode state
  const isControlled = value !== undefined;
  const initialDate = value ?? defaultValue ?? new Date();
  const initialEth = useMemo(() => calendarSystem === "ethiopian"
    ? toEthiopian(initialDate)
    : { year: initialDate.getFullYear(), month: initialDate.getMonth() + 1, day: initialDate.getDate() }, []);

  const [uncontrolledDate, setUncontrolledDate] = useState<Date | null>(
    defaultValue ?? (value === undefined ? new Date() : null),
  );

  const activeSelectedDate = isControlled ? (value ?? null) : uncontrolledDate;

  // Range mode state
  const isRangeControlled = selectedRange !== undefined;
  const [uncontrolledRange, setUncontrolledRange] = useState<EthiopianDateRange>(
    defaultSelectedRange ?? { startDate: null, endDate: null },
  );
  const activeSelectedRange: EthiopianDateRange = isRangeControlled
    ? (selectedRange ?? { startDate: null, endDate: null })
    : uncontrolledRange;

  // Display navigation state (which Ethiopian month/year is shown)
  const initialNavEth = useMemo(() => {
    if (selectionType === "range") {
      const base =
        (isRangeControlled ? selectedRange?.startDate : defaultSelectedRange?.startDate) ??
        value ??
        defaultValue ??
        new Date();
      return calendarSystem === "ethiopian"
        ? toEthiopian(base)
        : { year: base.getFullYear(), month: base.getMonth() + 1, day: base.getDate() };
    }
    return initialEth;
  }, []);

  const [displayedYear, setDisplayedYear] = useState<number>(initialNavEth.year);
  const [displayedMonth, setDisplayedMonth] = useState<number>(initialNavEth.month);
  // Selector view (quick month/year picker)
  const [isMonthYearSelectorOpen, setIsMonthYearSelectorOpen] = useState(false);

  const changeCalendarSystem = useCallback((system: CalendarType) => {
    if (system === calendarSystem) return;
    const anchorDate = calendarSystem === "ethiopian"
      ? toGregorian({ year: displayedYear, month: displayedMonth, day: 1 })
      : createGregorianDate(displayedYear, displayedMonth, 1);
    const next = system === "ethiopian"
      ? toEthiopian(anchorDate)
      : { year: anchorDate.getFullYear(), month: anchorDate.getMonth() + 1 };
    setDisplayedYear(next.year);
    setDisplayedMonth(next.month);
    setIsMonthYearSelectorOpen(false);
    if (props.calendarSystem === undefined) setInternalCalendarSystem(system === "ethiopian" ? "EC" : "GC");
    props.onCalendarSystemChange?.(system === "ethiopian" ? "EC" : "GC");
  }, [calendarSystem, displayedYear, displayedMonth, props.calendarSystem, props.onCalendarSystemChange]);

  // Modal mode state
  const [uncontrolledModalVisible, setUncontrolledModalVisible] = useState(defaultVisible);
  const isModalVisible = controlledVisible !== undefined ? controlledVisible : uncontrolledModalVisible;
  const [draftDate, setDraftDate] = useState<Date | null>(activeSelectedDate);
  const [draftRange, setDraftRange] = useState<EthiopianDateRange>(activeSelectedRange);

  // Sync displayed month/year when controlled value changes externally
  useEffect(() => {
    if (selectionType === "single" && value && value instanceof Date && !isNaN(value.getTime())) {
      const eth = dateToDisplay(value);
      setDisplayedYear(eth.year);
      setDisplayedMonth(eth.month);
      setDraftDate(value);
    }
  }, [selectionType, value, dateToDisplay]);

  // Sync displayed month/year when controlled selectedRange changes externally
  useEffect(() => {
    if (selectionType === "range" && selectedRange) {
      setDraftRange(selectedRange);
      if (selectedRange.startDate && selectedRange.startDate instanceof Date && !isNaN(selectedRange.startDate.getTime())) {
        const eth = dateToDisplay(selectedRange.startDate);
        setDisplayedYear(eth.year);
        setDisplayedMonth(eth.month);
      }
    }
  }, [selectionType, selectedRange, dateToDisplay]);

  // Sync draft whenever modal opens
  useEffect(() => {
    if (isModalVisible) {
      if (selectionType === "range") {
        setDraftRange(activeSelectedRange);
        const base = activeSelectedRange.startDate ?? new Date();
        const eth = dateToDisplay(base);
        setDisplayedYear(eth.year);
        setDisplayedMonth(eth.month);
      } else {
        setDraftDate(activeSelectedDate ?? new Date());
        const base = activeSelectedDate ?? new Date();
        const eth = dateToDisplay(base);
        setDisplayedYear(eth.year);
        setDisplayedMonth(eth.month);
      }
    }
  }, [isModalVisible, selectionType, dateToDisplay]);

  const isDateDisabled = useCallback(
    (gregDate: Date): boolean => {
      if (props.disabled) return true;

      if (minimumDate && isBeforeGregorianDay(gregDate, minimumDate)) {
        return true;
      }
      if (maximumDate && isAfterGregorianDay(gregDate, maximumDate)) {
        return true;
      }

      if (disabledDates) {
        if (typeof disabledDates === "function") {
          return disabledDates(gregDate);
        }
        if (Array.isArray(disabledDates)) {
          return disabledDates.some((d) => isSameGregorianDay(d, gregDate));
        }
      }

      return false;
    },
    [minimumDate, maximumDate, disabledDates, props.disabled],
  );

  const isDayDisabled = useCallback(
    (year: number, month: number, day: number): boolean => {
      const gregDate = calendarSystem === "ethiopian"
        ? toGregorian({ year, month, day })
        : createGregorianDate(year, month, day);
      return isDateDisabled(gregDate);
    },
    [isDateDisabled, calendarSystem],
  );

  const goToNextMonth = useCallback(() => {
    const next = calendarSystem === "ethiopian"
      ? nextEthiopianMonth(displayedYear, displayedMonth)
      : nextGregorianMonth(displayedYear, displayedMonth);
    setDisplayedYear(next.year);
    setDisplayedMonth(next.month);
  }, [displayedYear, displayedMonth, calendarSystem]);

  const goToPreviousMonth = useCallback(() => {
    const prev = calendarSystem === "ethiopian"
      ? previousEthiopianMonth(displayedYear, displayedMonth)
      : previousGregorianMonth(displayedYear, displayedMonth);
    setDisplayedYear(prev.year);
    setDisplayedMonth(prev.month);
  }, [displayedYear, displayedMonth, calendarSystem]);

  const goToNextYear = useCallback(() => {
    if (displayedYear < maxYear) {
      setDisplayedYear((y) => y + 1);
    }
  }, [displayedYear, maxYear]);

  const goToPreviousYear = useCallback(() => {
    if (displayedYear > minYear) {
      setDisplayedYear((y) => y - 1);
    }
  }, [displayedYear, minYear]);

  const setMonthAndYear = useCallback((year: number, month: number) => {
    setDisplayedYear(year);
    setDisplayedMonth(month);
    setIsMonthYearSelectorOpen(false);
  }, []);

  const isOverlayMode = mode === "modal" || mode === "sheet";

  const selectDay = useCallback(
    (day: number) => {
      const selectedGreg = calendarSystem === "ethiopian"
        ? toGregorian({ year: displayedYear, month: displayedMonth, day })
        : createGregorianDate(displayedYear, displayedMonth, day);

      if (isDateDisabled(selectedGreg)) {
        return;
      }

      if (selectionType === "range") {
        const currentRange = isOverlayMode ? draftRange : activeSelectedRange;
        let nextRange: EthiopianDateRange;

        if (!currentRange.startDate || (currentRange.startDate && currentRange.endDate)) {
          nextRange = { startDate: selectedGreg, endDate: null };
        } else if (isBeforeGregorianDay(selectedGreg, currentRange.startDate)) {
          nextRange = { startDate: selectedGreg, endDate: null };
        } else {
          nextRange = { startDate: currentRange.startDate, endDate: selectedGreg };
        }

        if (isOverlayMode) {
          setDraftRange(nextRange);
        } else {
          if (!isRangeControlled) {
            setUncontrolledRange(nextRange);
          }
          onRangeChange?.(nextRange);
        }
      } else {
        if (isOverlayMode) {
          setDraftDate(selectedGreg);
        } else {
          if (!isControlled) {
            setUncontrolledDate(selectedGreg);
          }
          onChange?.(selectedGreg);
        }
      }
    },
    [
      displayedYear,
      displayedMonth,
      calendarSystem,
      isDateDisabled,
      selectionType,
      isOverlayMode,
      draftRange,
      activeSelectedRange,
      isRangeControlled,
      onRangeChange,
      isControlled,
      onChange,
    ],
  );

  const goToToday = useCallback(() => {
    const now = new Date();
    const todayEth = dateToDisplay(now);
    setDisplayedYear(todayEth.year);
    setDisplayedMonth(todayEth.month);
    setIsMonthYearSelectorOpen(false);

    if (!isDateDisabled(now)) {
      if (selectionType === "range") {
        const range: EthiopianDateRange = { startDate: now, endDate: null };
        if (isOverlayMode) {
          setDraftRange(range);
        } else {
          if (!isRangeControlled) {
            setUncontrolledRange(range);
          }
          onRangeChange?.(range);
        }
      } else {
        if (isOverlayMode) {
          setDraftDate(now);
        } else {
          if (!isControlled) {
            setUncontrolledDate(now);
          }
          onChange?.(now);
        }
      }
    }
  }, [isDateDisabled, selectionType, isOverlayMode, isRangeControlled, onRangeChange, isControlled, onChange, dateToDisplay]);

  const goToDate = useCallback(
    (date: Date) => {
      const eth = dateToDisplay(date);
      setDisplayedYear(eth.year);
      setDisplayedMonth(eth.month);
      setIsMonthYearSelectorOpen(false);

      if (!isDateDisabled(date)) {
        if (selectionType === "range") {
          const range: EthiopianDateRange = { startDate: date, endDate: null };
          if (isOverlayMode) {
            setDraftRange(range);
          } else {
            if (!isRangeControlled) {
              setUncontrolledRange(range);
            }
            onRangeChange?.(range);
          }
        } else {
          if (isOverlayMode) {
            setDraftDate(date);
          } else {
            if (!isControlled) {
              setUncontrolledDate(date);
            }
            onChange?.(date);
          }
        }
      }
    },
    [isDateDisabled, selectionType, isOverlayMode, isRangeControlled, onRangeChange, isControlled, onChange, dateToDisplay],
  );

  const openModal = useCallback(() => {
    if (controlledVisible === undefined) {
      setUncontrolledModalVisible(true);
    }
    onOpen?.();
  }, [controlledVisible, onOpen]);

  const closeModal = useCallback(() => {
    if (controlledVisible === undefined) {
      setUncontrolledModalVisible(false);
    }
    onClose?.();
  }, [controlledVisible, onClose]);

  const confirmDraft = useCallback(() => {
    if (selectionType === "range") {
      if (!isRangeControlled) {
        setUncontrolledRange(draftRange);
      }
      onRangeChange?.(draftRange);
    } else {
      if (draftDate) {
        if (!isControlled) {
          setUncontrolledDate(draftDate);
        }
        onChange?.(draftDate);
      }
    }
    closeModal();
  }, [selectionType, isRangeControlled, draftRange, onRangeChange, draftDate, isControlled, onChange, closeModal]);

  const cancelDraft = useCallback(() => {
    if (selectionType === "range") {
      setDraftRange(activeSelectedRange);
    } else {
      setDraftDate(activeSelectedDate);
    }
    closeModal();
  }, [selectionType, activeSelectedRange, activeSelectedDate, closeModal]);

  const setRange = useCallback(
    (range: EthiopianDateRange) => {
      if (isOverlayMode) {
        setDraftRange(range);
      } else {
        if (!isRangeControlled) {
          setUncontrolledRange(range);
        }
        onRangeChange?.(range);
      }
    },
    [isOverlayMode, isRangeControlled, onRangeChange],
  );

  const toggleMonthYearSelector = useCallback(() => {
    setIsMonthYearSelectorOpen((open) => !open);
  }, []);

  const currentEffectiveRange = isOverlayMode ? draftRange : activeSelectedRange;
  const currentEffectiveDate = isOverlayMode ? draftDate : activeSelectedDate;

  return {
    selectionType,
    calendarSystem,
    changeCalendarSystem,
    selectedDate: currentEffectiveDate,
    selectedRange: currentEffectiveRange,
    displayedYear,
    displayedMonth,
    isMonthYearSelectorOpen,
    isModalVisible,
    draftDate,
    draftRange,
    isDateDisabled,
    isDayDisabled,
    goToNextMonth,
    goToPreviousMonth,
    goToNextYear,
    goToPreviousYear,
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
    setDisplayedYear,
    setDisplayedMonth,
  };
}
