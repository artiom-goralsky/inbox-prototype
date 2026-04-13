/**
 * Formats a date to the format used in date separators
 * @param date - Date object or string
 * @returns Formatted date string like "MONDAY, OCTOBER 20TH"
 */
export const formatDateSeparator = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  const months = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];

  const day = days[dateObj.getDay()];
  const month = months[dateObj.getMonth()];
  const dayOfMonth = dateObj.getDate();

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + 'ST';
    if (j === 2 && k !== 12) return num + 'ND';
    if (j === 3 && k !== 13) return num + 'RD';
    return num + 'TH';
  };

  return `${day}, ${month} ${getOrdinalSuffix(dayOfMonth)}`;
};

/**
 * Checks if a date is today
 * @param date - Date object or string
 * @returns boolean
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Gets the appropriate date separator text
 * @param date - Date object or string
 * @returns "TODAY" if it's today, otherwise formatted date
 */
export const getDateSeparatorText = (date: Date | string): string => {
  return isToday(date) ? 'TODAY' : formatDateSeparator(date);
};
