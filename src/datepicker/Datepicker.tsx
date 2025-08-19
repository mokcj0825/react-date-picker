import React, { useState, useEffect, useRef } from 'react';
import CalendarIcon from './CalendarIcon';


export interface DatePickerProps {
  minDate?: Date;
  maxDate?: Date;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onDateSelected?: (date: Date) => void;
  placeholder?: string;
  isDarkMode?: boolean;
  languageCodeKey?: string; // Key to get language code from localStorage
  weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
  disabled?: boolean;
}

const getLocaleFromStorage = (languageCodeKey?: string): string => {
  if (!languageCodeKey) return 'en-US';
  
  try {
    const languageCode = localStorage.getItem(languageCodeKey);
    if (languageCode) {
      // Map common language codes to full locales
      const localeMap: Record<string, string> = {
        'en': 'en-US',
        'zh': 'zh-CN',
        'ms': 'ms-MY',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'es': 'es-ES',
        'pt': 'pt-BR',
        'ru': 'ru-RU',
        'ar': 'ar-SA',
        'hi': 'hi-IN'
      };
      return localeMap[languageCode] || languageCode;
    }
  } catch (error) {
    console.warn('Failed to get language code from localStorage:', error);
  }
  
  return 'en-US';
};

const getMonthsForLocale = (locale: string) => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    months.push(date.toLocaleDateString(locale, { month: 'long' }));
  }
  return months;
};

const getWeekdaysForLocale = (locale: string, weekStartsOn: number) => {
  const weekdays = [];
  
  for (let i = 0; i < 7; i++) {
    // Create a date for each day of the week
    // weekStartsOn: 0 = Sunday, 1 = Monday
    const dayOfWeek = weekStartsOn === 1 ? i + 1 : i === 6 ? 0 : i + 1;
    const date = new Date(2024, 0, dayOfWeek === 0 ? 7 : dayOfWeek); // January 7 = Sunday, January 1 = Monday
    weekdays.push(date.toLocaleDateString(locale, { weekday: 'short' }));
  }
  return weekdays;
};

const Datepicker = ({minDate = new Date(0), maxDate, selectedDate, onDateChange, onDateSelected, placeholder, isDarkMode, languageCodeKey, weekStartsOn = 1, disabled = false}: DatePickerProps) => {
  // Vanilla CSS-in-JS styles for complete isolation - EXACTLY matching the original CSS module
  const defaultStyles: Record<string, React.CSSProperties> = {
    datepicker: { position: 'relative', display: 'inline-block', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    rhombus: { position: 'absolute', top: '-6px', left: '20px', width: '12px', height: '12px', background: '#F0F0F0', transform: 'rotate(45deg)', zIndex: 1001, borderTop: '1px solid #d1d5db', borderLeft: '1px solid #d1d5db' },
    dropdownContainer: { position: 'absolute', top: 'calc(100% + 10px)', left: '0', zIndex: 1000 },
    triggerButton: { position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer', transition: 'border-color 0.2s', color: '#6c6c6c' },
    calendarIcon: { color: '#6c6c6c' },
    dropdown: { position: 'relative', top: '0', left: '0', background: '#F0F0F0', border: '1px solid #d1d5db', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '253px', height: 'auto', boxSizing: 'border-box', paddingTop: '8px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', padding: '8px 0', height: '33px' },
    navigation: { display: 'flex', alignItems: 'center', gap: '8px' },
    navButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background-color 0.2s', color: '#000' },
    selectors: { display: 'flex', gap: '8px' },
    yearSelect: { padding: '4px 8px', borderRadius: '4px', borderColor: 'transparent', background: '#F0F0F0', fontSize: '14px', color: '#000' },
    monthSelect: { padding: '4px 8px', borderRadius: '4px', borderColor: 'transparent', background: '#F0F0F0', fontSize: '14px', color: '#000' },
    weekdays: { display: 'flex', flexDirection: 'row', borderBottom: '1px solid #aeaeae', justifyContent: 'center' },
    weekday: { textAlign: 'center', fontSize: '12px', fontWeight: '500', color: '#000', margin: '0.166rem', width: '1.7rem', lineHeight: '1.7rem' },
    calendar: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', backgroundColor: 'white', padding: '8px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' },
    calendarDay: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '27.1875px', lineHeight: '27.2px', fontWeight: '400', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12.8px', transition: 'background-color 0.2s', color: '#000' },
    selected: { backgroundColor: '#3b82f6', color: 'white' },
    today: { border: '2px solid #3b82f6' },
    disabled: { color: '#d1d5db', cursor: 'not-allowed' }
  };

  const finalStyles = defaultStyles;

  // Dark mode styles that override the default styles
  const darkModeStyles: Record<string, React.CSSProperties> = {
    triggerButton: { background: '#464646', borderColor: 'transparent', color: '#a5a5a5' },
    calendarIcon: { color: 'white' },
    dropdown: { background: '#464646', borderColor: '#374151', color: 'white' },
    rhombus: { background: '#464646', borderTopColor: '#374151', borderLeftColor: '#374151' },
    navButton: { color: '#FFFFFF' },
    yearSelect: { background: '#464646', borderColor: 'transparent', color: 'white' },
    monthSelect: { background: '#464646', borderColor: 'transparent', color: 'white' },
    calendar: { backgroundColor: '#464646', color: '#FFFFFF' },
    weekday: { color: '#d1d5db' },
    calendarDay: { color: '#FFFFFF' },
    disabled: { color: '#4b5563' }
  };

  // Apply dark mode styles if dark mode is enabled
  const appliedStyles = isDarkMode ? 
    Object.fromEntries(
      Object.entries(finalStyles).map(([key, value]) => [
        key, 
        { ...value, ...(darkModeStyles[key] || {}) }
      ])
    ) : finalStyles;

  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [displayDate, setDisplayDate] = useState(selectedDate || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: true, left: true });
  
  const locale = getLocaleFromStorage(languageCodeKey);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const checkViewportPosition = () => {
        const trigger = dropdownRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dropdownWidth = 253; // Width of dropdown
        const dropdownHeight = 320; // Approximate height of dropdown

        const newPosition = {
          top: rect.bottom + dropdownHeight <= viewportHeight,
          left: rect.left + dropdownWidth <= viewportWidth
        };

        setDropdownPosition(newPosition);
      };

      // Reset position first, then check after a small delay
      setDropdownPosition({ top: true, left: true });
      setTimeout(checkViewportPosition, 0);
      window.addEventListener('resize', checkViewportPosition);
      
      return () => {
        window.removeEventListener('resize', checkViewportPosition);
      };
    }
  }, [isOpen]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert to match weekStartsOn setting
    return weekStartsOn === 1 ? (day === 0 ? 6 : day - 1) : day;
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    // Check if the new month would be before minDate
    if (
      minDate &&
      newDate < new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    ) {
      return; // Don't allow navigation before minDate
    }
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    // Check if the new month would be after maxDate
    if (
      maxDate &&
      newDate > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
    ) {
      return; // Don't allow navigation after maxDate
    }
    setCurrentDate(newDate);
  };

  const handleYearChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleMonthChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleDateSelect = (day: number, month?: Date) => {
    const targetMonth = month || currentDate;
    const newDate = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      day,
    );
    
    // If selecting a date from a different month, update the current view
    if (month && (month.getMonth() !== currentDate.getMonth() || month.getFullYear() !== currentDate.getFullYear())) {
      setCurrentDate(new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1));
    }
    
    setDisplayDate(newDate);
    onDateChange?.(newDate);
    onDateSelected?.(newDate);
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Get the previous month's last days
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const daysInPreviousMonth = getDaysInMonth(previousMonth);

    // Add previous month's days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const previousDay = daysInPreviousMonth - firstDayOfMonth + i + 1;
      const previousDate = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), previousDay);
      
      const isDisabled = (minDate && previousDate < minDate) || (maxDate && previousDate > maxDate);
      
      days.push(
        <div
          key={`prev-${previousDay}`}
          onClick={() => !isDisabled && handleDateSelect(previousDay, previousMonth)}
          style={{ ...appliedStyles.calendarDay, ...(isDisabled ? appliedStyles.disabled : {}), opacity: 0.5 }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#6b7280' : '#f3f4f6';
              e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#000000';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#000000';
            }
          }}
        >
          {previousDay}
        </div>
      );
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const isSelected =
        displayDate.getDate() === day &&
        displayDate.getMonth() === currentDate.getMonth() &&
        displayDate.getFullYear() === currentDate.getFullYear();
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      // Check if date is within allowed range
      const isDisabled =
        (minDate && currentDayDate < minDate) ||
        (maxDate && currentDayDate > maxDate);

            days.push(
        <div
          key={day}
          onClick={() => !isDisabled && handleDateSelect(day)}
          style={{ 
            ...appliedStyles.calendarDay, 
            ...(isSelected ? appliedStyles.selected : {}), 
            ...(isToday ? appliedStyles.today : {}), 
            ...(isDisabled ? appliedStyles.disabled : {}),
            ...(isDarkMode && !isDisabled ? { ':hover': { backgroundColor: '#464646', color: '#FFFFFF' } } : {})
          }}
          onMouseEnter={(e) => {
            if (!isDisabled && !isSelected) {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#6b7280' : '#f3f4f6';
              e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#000000';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled && !isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#000000';
            }
          }}
        >
          {day}
        </div>,
      );
    }

    // Add next month's days to fill the remaining cells (always 42 total cells for 6 weeks)
    const totalCells = 42; // 6 weeks × 7 days
    const remainingCells = totalCells - (firstDayOfMonth + daysInMonth);
    
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      const nextDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
      
      const isDisabled = (minDate && nextDate < minDate) || (maxDate && nextDate > maxDate);
      
      days.push(
        <div
          key={`next-${i}`}
          onClick={() => !isDisabled && handleDateSelect(i, nextMonth)}
          style={{ ...appliedStyles.calendarDay, ...(isDisabled ? appliedStyles.disabled : {}), opacity: 0.5 }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#6b7280' : '#f3f4f6';
              e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#000000';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = isDarkMode ? '#FFFFFF' : '#000000';
            }
          }}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div
      style={appliedStyles.datepicker}
      data-theme={isDarkMode ? "dark" : undefined}
      ref={dropdownRef}
    >
      <div
        style={{ ...appliedStyles.triggerButton, ...(disabled ? appliedStyles.disabled : {}) }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = '#9ca3af';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = '#d1d5db';
          }
        }}
      >
        <div style={appliedStyles.calendarIcon}>
          <CalendarIcon />
        </div>
        {isWideScreen && (
          <span>
            {selectedDate ? formatDate(selectedDate) : (placeholder || formatDate(new Date()))}
          </span>
        )}
      </div>

      {isOpen && (
        <div 
          ref={dropdownContainerRef}
          style={{
            ...appliedStyles.dropdownContainer,
            top: dropdownPosition.top ? 'calc(100% + 10px)' : 'auto',
            bottom: dropdownPosition.top ? 'auto' : 'calc(100% + 10px)',
            left: dropdownPosition.left ? '0' : 'auto',
            right: dropdownPosition.left ? 'auto' : '0'
          }}
        >
          <Rhombus styles={appliedStyles} position={dropdownPosition} />
          <div style={appliedStyles.dropdown}>
                      <div style={appliedStyles.header}>
              <LeftNavigationButton
                minDate={minDate}
                currentDate={currentDate}
                onClick={handlePreviousMonth}
                styles={appliedStyles}
              />

              <div style={appliedStyles.selectors}>
                <YearSelector
                  currentDate={currentDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  onYearChange={handleYearChange}
                  styles={appliedStyles}
                />
                <MonthSelector
                  currentDate={currentDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  onMonthChange={handleMonthChange}
                  styles={appliedStyles}
                  locale={locale}
                />
              </div>

              <RightNavigationButton
                maxDate={maxDate}
                currentDate={currentDate}
                onClick={handleNextMonth}
                styles={appliedStyles}
              />
            </div>

            <WeekdayIndicator styles={appliedStyles} locale={locale} weekStartsOn={weekStartsOn} />

            <div style={appliedStyles.calendar}>{generateCalendarDays()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Datepicker;

const Rhombus = ({styles, position}: {styles: Record<string, React.CSSProperties>, position: { top: boolean, left: boolean }}) => {
  return (
    <div 
      style={{
        ...styles.rhombus,
        top: position.top ? '-6px' : 'auto',
        bottom: position.top ? 'auto' : '-6px',
        left: position.left ? '20px' : 'auto',
        right: position.left ? 'auto' : '20px'
      }}
    ></div>
  )
}

type SelectorProp = {
  currentDate: Date;
  minDate: Date;
  maxDate?: Date;
  styles: Record<string, React.CSSProperties>;
};

const YearSelector = ({
                        currentDate,
                        minDate,
                        maxDate,
                        onYearChange,
                        styles,
                      }: SelectorProp & { onYearChange: (date: Date) => void }) => {
  const currentYear = new Date().getFullYear();
  const minYear = minDate.getFullYear();
  const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 10;

  const allYears = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  const years = allYears.filter((year) => {
    if (year < minDate.getFullYear()) return false;
    return !(maxDate && year > maxDate.getFullYear());
  });

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    let newDate = new Date(newYear, currentDate.getMonth(), 1);
    if (
      minDate &&
      newDate < new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    ) {
      newDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    } else if (
      maxDate &&
      newDate > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
    ) {
      newDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    }

    onYearChange(newDate);
  };

  return (
    <select
      value={currentDate.getFullYear()}
      onChange={onChange}
      style={styles.yearSelect}
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

const MonthSelector = ({
                         currentDate,
                         minDate,
                         maxDate,
                         onMonthChange,
                         locale,
                         styles,
                       }: SelectorProp & { onMonthChange: (date: Date) => void; locale: string }) => {
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value);
    let newDate = new Date(currentDate.getFullYear(), newMonth, 1);

    if (
      minDate &&
      newDate < new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    ) {
      newDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    } else if (
      maxDate &&
      newDate > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
    ) {
      newDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    }
    onMonthChange(newDate);
  };

  const months = getMonthsForLocale(locale);

  return (
    <select
      value={currentDate.getMonth()}
      onChange={onChange}
      style={styles.monthSelect}
    >
      {months.map((month: string, index: number) => {
        const monthDate = new Date(currentDate.getFullYear(), index, 1);
        const isDisabled =
          (minDate &&
            monthDate <
            new Date(minDate.getFullYear(), minDate.getMonth(), 1)) ||
          (maxDate &&
            monthDate > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1));

        return (
          <option key={month} value={index} disabled={isDisabled}>
            {month}
          </option>
        );
      })}
    </select>
  );
};

const LeftNavigationButton = ({
                                minDate,
                                currentDate,
                                onClick,
                                styles,
                              }: {
  minDate: Date;
  currentDate: Date;
  onClick: () => void;
  styles: Record<string, React.CSSProperties>;
}) => {
  const isPreviousDisabled =
    minDate &&
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1) <
    new Date(minDate.getFullYear(), minDate.getMonth(), 1);

  return (
    <button
      style={styles.navButton}
      onClick={onClick}
      disabled={isPreviousDisabled}
      aria-label="Previous month"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const RightNavigationButton = ({
                                 maxDate,
                                 currentDate,
                                 onClick,
                                 styles,
                               }: {
  maxDate?: Date;
  currentDate: Date;
  onClick: () => void;
  styles: Record<string, React.CSSProperties>;
}) => {
  const isNextDisabled =
    maxDate &&
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) >
    new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  return (
    <button
      style={styles.navButton}
      onClick={onClick}
      disabled={isNextDisabled}
      aria-label="Next month"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const WeekdayIndicator = ({ styles, locale, weekStartsOn }: { styles: Record<string, React.CSSProperties>; locale: string; weekStartsOn: number }) => {
  const weekdays = getWeekdaysForLocale(locale, weekStartsOn);
  
  return (
    <div style={styles.weekdays}>
      {weekdays.map((day) => (
        <div key={day} style={styles.weekday}>
          {day}
        </div>
      ))}
    </div>
  );
};
