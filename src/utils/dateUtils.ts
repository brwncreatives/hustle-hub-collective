export const getCurrentWeekInQuarter = (date: Date | string): number => {
  if (typeof date === 'string') {
    // Handle quarter string format (e.g. "Q1-2024")
    const [quarter, year] = date.split('-');
    const quarterNumber = parseInt(quarter.slice(1));
    const startMonth = (quarterNumber - 1) * 3;
    const quarterStart = new Date(parseInt(year), startMonth, 1);
    const now = new Date();
    const diff = now.getTime() - quarterStart.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.min(Math.max(Math.ceil(diff / oneWeek), 1), 12);
  } else {
    // Handle Date object
    const month = date.getMonth();
    const quarterNumber = Math.floor(month / 3) + 1;
    const quarterStartMonth = (quarterNumber - 1) * 3;
    const quarterStart = new Date(date.getFullYear(), quarterStartMonth, 1);
    const diff = date.getTime() - quarterStart.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.min(Math.max(Math.ceil(diff / oneWeek), 1), 12);
  }
};