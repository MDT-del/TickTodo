import React, { useState } from 'react';
import moment from 'moment-jalaali';
import { FaCalendarAlt } from 'react-icons/fa';

// Configure moment-jalaali
moment.loadPersian({
  dialect: 'persian-modern',
  usePersianDigits: true
});

const PersianDatePicker = ({ value, onChange, placeholder = "انتخاب تاریخ" }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  // Simple Persian date picker using HTML date input
  // The date will be stored in ISO format but displayed in Persian
  
  const formatPersianDate = (isoDate) => {
    if (!isoDate) return '';
    const momentDate = moment(isoDate);
    return momentDate.format('jYYYY/jMM/jDD');
  };

  const handleDateChange = (e) => {
    const isoDate = e.target.value;
    setSelectedDate(isoDate);
    onChange(isoDate);
  };

  return (
    <div className="persian-date-picker relative">
      <div className="relative">
        <input
          type="date"
          value={selectedDate || ''}
          onChange={handleDateChange}
          className="input-field pr-10"
          placeholder={placeholder}
        />
        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      
      {selectedDate && (
        <div className="mt-1 text-sm text-gray-600">
          تاریخ شمسی: {formatPersianDate(selectedDate)}
        </div>
      )}
    </div>
  );
};

export default PersianDatePicker;