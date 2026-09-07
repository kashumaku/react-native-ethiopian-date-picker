import { useState, useEffect, useCallback, useMemo } from "react";
import { toEthiopian } from "../conversion/gregorianToEthiopian";
import { toGregorian } from "../conversion/ethiopianToGregorian";
import {
  isSameGregorianDay,
  isBeforeGregorianDay,
  isAfterGregorianDay,
  isToday,
} from "../conversion/comparison";
import { nextEthiopianMonth, previousEthiopianMonth } from "../calendar/month";
import type {
  EthiopianDatePickerProps,
  EthiopianDate,
  EthiopianDateRange,
} from "../types";

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

  // Single date mode state
  const isControlled = value !== undefined;
  const initialDate = value ?? defaultValue ?? new Date();
  const initialEth = useMemo(() => toEthiopian(initialDate), []);

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
      return toEthiopian(base);
    }
    return initialEth;
  }, []);

  const [displayedYear, setDisplayedYear] = useState<number>(initialNavEth.year);
  const [displayedMonth, setDisplayedMonth] = useState<number>(initialNavEth.month);

  // Selector view (quick month/year picker)
  const [isMonthYearSelectorOpen, setIsMonthYearSelectorOpen] = useState(false);

  // Modal mode state
  const [uncontrolledModalVisible, setUncontrolledModalVisible] = useState(defaultVisible);
  const isModalVisible = controlledVisible !== undefined ? controlledVisible : uncontrolledModalVisible;
  const [draftDate, setDraftDate] = useState<Date | null>(activeSelectedDate);
  const [draftRange, setDraftRange] = useState<EthiopianDateRange>(activeSelectedRange);

  // Sync displayed month/year when controlled value changes externally
  useEffect(() => {
    if (selectionType === "single" && value && value instanceof Date && !isNaN(value.getTime())) {
      const eth = toEthiopian(value);
      setDisplayedYear(eth.year);
      setDisplayedMonth(eth.month);
      setDraftDate(value);
    }
  }, [selectionType, value]);

  // Sync displayed month/year when controlled selectedRange changes externally
  useEffect(() => {
    if (selectionType === "range" && selectedRange) {
      setDraftRange(selectedRange);
      if (selectedRange.startDate && selectedRange.startDate instanceof Date && !isNaN(selectedRange.startDate.getTime())) {
        const eth = toEthiopian(selectedRange.startDate);
        setDisplayedYear(eth.year);
        setDisplayedMonth(eth.month);
      }
    }
  }, [selectionType, selectedRange]);

  // Sync draft whenever modal opens
  useEffect(() => {
    if (isModalVisible) {
      if (selectionType === "range") {
        setDraftRange(activeSelectedRange);
        const base = activeSelectedRange.startDate ?? new Date();
        const eth = toEthiopian(base);
        setDisplayedYear(eth.year);
        setDisplayedMonth(eth.month);
      } else {
        setDraftDate(activeSelectedDate ?? new Date());
        const base = activeSelectedDate ?? new Date();
        const eth = toEthiopian(base);
        setDisplayedYear(eth.year);
        setDisplayedMonth(eth.month);
      }
    }
  }, [isModalVisible, selectionType]);

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
      const gregDate = toGregorian({ year, month, day });
      return isDateDisabled(gregDate);
    },
    [isDateDisabled],
  );

  const goToNextMonth = useCallback(() => {
    const next = nextEthiopianMonth(displayedYear, displayedMonth);
    setDisplayedYear(next.year);
    setDisplayedMonth(next.month);
  }, [displayedYear, displayedMonth]);

  const goToPreviousMonth = useCallback(() => {
    const prev = previousEthiopianMonth(displayedYear, displayedMonth);
    setDisplayedYear(prev.year);
    setDisplayedMonth(prev.month);
  }, [displayedYear, displayedMonth]);

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

  const selectDay = useCallback(
    (day: number) => {
      const selectedGreg = toGregorian({
        year: displayedYear,
        month: displayedMonth,
        day,
      });

      if (isDateDisabled(selectedGreg)) {
        return;
      }

      if (selectionType === "range") {
        const currentRange = mode === "modal" ? draftRange : activeSelectedRange;
        let nextRange: EthiopianDateRange;

        if (!currentRange.startDate || (currentRange.startDate && currentRange.endDate)) {
          nextRange = { startDate: selectedGreg, endDate: null };
        } else if (isBeforeGregorianDay(selectedGreg, currentRange.startDate)) {
          nextRange = { startDate: selectedGreg, endDate: null };
        } else {
          nextRange = { startDate: currentRange.startDate, endDate: selectedGreg };
        }

        if (mode === "modal") {
          setDraftRange(nextRange);
        } else {
          if (!isRangeControlled) {
            setUncontrolledRange(nextRange);
          }
          onRangeChange?.(nextRange);
        }
      } else {
        if (mode === "modal") {
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
      isDateDisabled,
      selectionType,
      mode,
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
    const todayEth = toEthiopian(now);
    setDisplayedYear(todayEth.year);
    setDisplayedMonth(todayEth.month);
    setIsMonthYearSelectorOpen(false);

    if (!isDateDisabled(now)) {
      if (selectionType === "range") {
        const range: EthiopianDateRange = { startDate: now, endDate: null };
        if (mode === "modal") {
          setDraftRange(range);
        } else {
          if (!isRangeControlled) {
            setUncontrolledRange(range);
          }
          onRangeChange?.(range);
        }
      } else {
        if (mode === "modal") {
          setDraftDate(now);
        } else {
          if (!isControlled) {
            setUncontrolledDate(now);
          }
          onChange?.(now);
        }
      }
    }
  }, [isDateDisabled, selectionType, mode, isRangeControlled, onRangeChange, isControlled, onChange]);

  const goToDate = useCallback(
    (date: Date) => {
      const eth = toEthiopian(date);
      setDisplayedYear(eth.year);
      setDisplayedMonth(eth.month);
      setIsMonthYearSelectorOpen(false);

      if (!isDateDisabled(date)) {
        if (selectionType === "range") {
          const range: EthiopianDateRange = { startDate: date, endDate: null };
          if (mode === "modal") {
            setDraftRange(range);
          } else {
            if (!isRangeControlled) {
              setUncontrolledRange(range);
            }
            onRangeChange?.(range);
          }
        } else {
          if (mode === "modal") {
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
    [isDateDisabled, selectionType, mode, isRangeControlled, onRangeChange, isControlled, onChange],
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
      if (mode === "modal") {
        setDraftRange(range);
      } else {
        if (!isRangeControlled) {
          setUncontrolledRange(range);
        }
        onRangeChange?.(range);
      }
    },
    [mode, isRangeControlled, onRangeChange],
  );

  const toggleMonthYearSelector = useCallback(() => {
    setIsMonthYearSelectorOpen((open) => !open);
  }, []);

  const currentEffectiveRange = mode === "modal" ? draftRange : activeSelectedRange;
  const currentEffectiveDate = mode === "modal" ? draftDate : activeSelectedDate;

  return {
    selectionType,
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
