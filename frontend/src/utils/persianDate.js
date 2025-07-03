import moment from 'moment-jalaali';

// Configure moment-jalaali
moment.loadPersian({
  dialect: 'persian-modern',
  usePersianDigits: true
});

// Helper functions for Persian date handling
export const persianDateUtils = {
  // Convert ISO date to Persian format
  formatPersianDate: (isoDate) => {
    if (!isoDate) return '';
    const momentDate = moment(isoDate);
    return momentDate.format('jYYYY/jMM/jDD');
  },

  // Convert ISO date to Persian date with day name
  formatPersianDateWithDay: (isoDate) => {
    if (!isoDate) return '';
    const momentDate = moment(isoDate);
    return momentDate.format('dddd، jD jMMMM jYYYY');
  },

  // Convert ISO date to relative Persian date (e.g., "امروز", "دیروز", "۳ روز پیش")
  formatRelativePersianDate: (isoDate) => {
    if (!isoDate) return '';
    const momentDate = moment(isoDate);
    const now = moment();
    const daysDiff = now.diff(momentDate, 'days');
    
    if (daysDiff === 0) return 'امروز';
    if (daysDiff === 1) return 'دیروز';
    if (daysDiff === -1) return 'فردا';
    if (daysDiff > 0) return `${daysDiff} روز پیش`;
    if (daysDiff < 0) return `${Math.abs(daysDiff)} روز آینده`;
    
    return persianDateUtils.formatPersianDate(isoDate);
  },

  // Get current Persian date
  getCurrentPersianDate: () => {
    return moment().format('jYYYY/jMM/jDD');
  },

  // Get current Persian date and time
  getCurrentPersianDateTime: () => {
    return moment().format('jYYYY/jMM/jDD - HH:mm');
  },

  // Check if date is today
  isToday: (isoDate) => {
    if (!isoDate) return false;
    const momentDate = moment(isoDate);
    const today = moment();
    return momentDate.isSame(today, 'day');
  },

  // Check if date is overdue
  isOverdue: (isoDate) => {
    if (!isoDate) return false;
    const momentDate = moment(isoDate);
    const today = moment();
    return momentDate.isBefore(today, 'day');
  },

  // Check if date is in the future
  isFuture: (isoDate) => {
    if (!isoDate) return false;
    const momentDate = moment(isoDate);
    const today = moment();
    return momentDate.isAfter(today, 'day');
  },

  // Convert Persian date string to ISO
  persianToISO: (persianDate) => {
    if (!persianDate) return null;
    try {
      const momentDate = moment(persianDate, 'jYYYY/jMM/jDD');
      return momentDate.format('YYYY-MM-DD');
    } catch (error) {
      console.error('Error converting Persian date to ISO:', error);
      return null;
    }
  },

  // Get Persian month names
  getPersianMonthNames: () => [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ],

  // Get Persian day names
  getPersianDayNames: () => [
    'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
  ],

  // Get Persian day names short
  getPersianDayNamesShort: () => [
    'ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'
  ],

  // Format time in Persian
  formatPersianTime: (time) => {
    if (!time) return '';
    
    // Convert to Persian digits
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
    
    let persianTime = time;
    for (let i = 0; i < englishDigits.length; i++) {
      const regex = new RegExp(englishDigits[i], 'g');
      persianTime = persianTime.replace(regex, persianDigits[i]);
    }
    
    return persianTime;
  },

  // Convert Persian digits to English
  persianToEnglishDigits: (str) => {
    if (!str) return '';
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
    
    let result = str;
    for (let i = 0; i < persianDigits.length; i++) {
      const regex = new RegExp(persianDigits[i], 'g');
      result = result.replace(regex, englishDigits[i]);
    }
    
    return result;
  },

  // Convert English digits to Persian
  englishToPersianDigits: (str) => {
    if (!str) return '';
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
    
    let result = str.toString();
    for (let i = 0; i < englishDigits.length; i++) {
      const regex = new RegExp(englishDigits[i], 'g');
      result = result.replace(regex, persianDigits[i]);
    }
    
    return result;
  }
};

export default persianDateUtils;