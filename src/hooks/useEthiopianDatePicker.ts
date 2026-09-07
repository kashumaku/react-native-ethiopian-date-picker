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
import type { EthiopianDatePickerProps, EthiopianDate } from "../types";

export function useEthiopianDatePicker(props: EthiopianDatePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    minimumDate,
    maximumDate,
    disabledDates,
    mode = "inline",
    visible: controlledVisible,
    onOpen,
    onClose,
    minYear = 1900,
    maxYear = 2100,
  } = props;

  const isControlled = value !== undefined;
  const initialDate = value ?? defaultValue ?? new Date();
  const initialEth = useMemo(() => toEthiopian(initialDate), []);

  const [uncontrolledDate, setUncontrolledDate] = useState<Date | null>(
    defaultValue ?? (value === undefined ? new Date() : null),
  );

  const activeSelectedDate = isControlled ? (value ?? null) : uncontrolledDate;

  // Display navigation state (which Ethiopian month/year is shown)
  const [displayedYear, setDisplayedYear] = useState<number>(initialEth.year);
  const [displayedMonth, setDisplayedMonth] = useState<number>(initialEth.month);

  // Selector view (quick month/year picker)
  const [isMonthYearSelectorOpen, setIsMonthYearSelectorOpen] = useState(false);

  // Modal mode state
  const [uncontrolledModalVisible, setUncontrolledModalVisible] = useState(false);
  const isModalVisible = controlledVisible !== undefined ? controlledVisible : uncontrolledModalVisible;
  const [draftDate, setDraftDate] = useState<Date | null>(activeSelectedDate);

  // Sync displayed month/year when controlled value changes externally
  useEffect(() => {
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      const eth = toEthiopian(value);
      setDisplayedYear(eth.year);
      setDisplayedMonth(eth.month);
      setDraftDate(value);
    }
  }, [value]);

  // Sync draftDate whenever modal opens
  useEffect(() => {
    if (isModalVisible) {
      setDraftDate(activeSelectedDate ?? new Date());
      const base = activeSelectedDate ?? new Date();
      const eth = toEthiopian(base);
      setDisplayedYear(eth.year);
      setDisplayedMonth(eth.month);
    }
  }, [isModalVisible]);

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

      if (mode === "modal") {
        setDraftDate(selectedGreg);
      } else {
        if (!isControlled) {
          setUncontrolledDate(selectedGreg);
        }
        onChange?.(selectedGreg);
      }
    },
    [displayedYear, displayedMonth, isDateDisabled, mode, isControlled, onChange],
  );

  const goToToday = useCallback(() => {
    const now = new Date();
    const todayEth = toEthiopian(now);
    setDisplayedYear(todayEth.year);
    setDisplayedMonth(todayEth.month);
    setIsMonthYearSelectorOpen(false);

    if (!isDateDisabled(now)) {
      if (mode === "modal") {
        setDraftDate(now);
      } else {
        if (!isControlled) {
          setUncontrolledDate(now);
        }
        onChange?.(now);
      }
    }
  }, [isDateDisabled, mode, isControlled, onChange]);

  const goToDate = useCallback(
    (date: Date) => {
      const eth = toEthiopian(date);
      setDisplayedYear(eth.year);
      setDisplayedMonth(eth.month);
      setIsMonthYearSelectorOpen(false);

      if (!isDateDisabled(date)) {
        if (mode === "modal") {
          setDraftDate(date);
        } else {
          if (!isControlled) {
            setUncontrolledDate(date);
          }
          onChange?.(date);
        }
      }
    },
    [isDateDisabled, mode, isControlled, onChange],
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
    if (draftDate) {
      if (!isControlled) {
        setUncontrolledDate(draftDate);
      }
      onChange?.(draftDate);
    }
    closeModal();
  }, [draftDate, isControlled, onChange, closeModal]);

  const cancelDraft = useCallback(() => {
    setDraftDate(activeSelectedDate);
    closeModal();
  }, [activeSelectedDate, closeModal]);

  const toggleMonthYearSelector = useCallback(() => {
    setIsMonthYearSelectorOpen((open) => !open);
  }, []);

  return {
    selectedDate: mode === "modal" ? draftDate : activeSelectedDate,
    displayedYear,
    displayedMonth,
    isMonthYearSelectorOpen,
    isModalVisible,
    draftDate,
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
    toggleMonthYearSelector,
    setDisplayedYear,
    setDisplayedMonth,
  };
}
