import React from 'react';
import { Calendar } from 'react-persian-calendar-date-picker';
import moment from 'moment-jalaali';
import 'react-persian-calendar-date-picker/lib/DatePicker.css';

// Configure moment-jalaali
moment.loadPersian({
  dialect: 'persian-modern',
  usePersianDigits: true
});

const PersianDatePicker = ({ value, onChange, placeholder = "انتخاب تاریخ" }) => {
  // Convert ISO date to Persian date object
  const convertISOToPersian = (isoDate) => {
    if (!isoDate) return null;
    const momentDate = moment(isoDate);
    return {
      year: momentDate.jYear(),
      month: momentDate.jMonth() + 1,
      day: momentDate.jDate()
    };
  };

  // Convert Persian date object to ISO date
  const convertPersianToISO = (persianDate) => {
    if (!persianDate) return null;
    const momentDate = moment(`${persianDate.year}/${persianDate.month}/${persianDate.day}`, 'jYYYY/jM/jD');
    return momentDate.format('YYYY-MM-DD');
  };

  // Format Persian date for display
  const formatPersianDate = (persianDate) => {
    if (!persianDate) return '';
    const momentDate = moment(`${persianDate.year}/${persianDate.month}/${persianDate.day}`, 'jYYYY/jM/jD');
    return momentDate.format('jYYYY/jMM/jDD');
  };

  const handleDateChange = (date) => {
    const isoDate = convertPersianToISO(date);
    onChange(isoDate);
  };

  const currentValue = convertISOToPersian(value);

  return (
    <div className="persian-date-picker">
      <Calendar
        value={currentValue}
        onChange={handleDateChange}
        locale="fa"
        shouldHighlightWeekends
        renderInput={({ ref }) => (
          <input
            ref={ref}
            placeholder={placeholder}
            value={currentValue ? formatPersianDate(currentValue) : ''}
            className="input-field"
            readOnly
          />
        )}
        calendarClassName="persian-calendar"
        calendarTodayClassName="today"
        calendarSelectedDayClassName="selected-day"
        calendarRangeStartClassName="range-start"
        calendarRangeEndClassName="range-end"
        calendarRangeBetweenClassName="range-between"
        minimumDate={{
          year: 1400,
          month: 1,
          day: 1
        }}
        maximumDate={{
          year: 1410,
          month: 12,
          day: 29
        }}
      />
    </div>
  );
};

export default PersianDatePicker;