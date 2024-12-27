export const getCurrentWeekInQuarter = (goalQuarter: string | null): number => {
  if (!goalQuarter) return 1;

  const [quarter, year] = goalQuarter.split('-');
  const quarterNumber = parseInt(quarter.slice(1));
  const startMonth = (quarterNumber - 1) * 3;
  
  const now = new Date();
  const quarterStart = new Date(parseInt(year), startMonth, 1);
  const diff = now.getTime() - quarterStart.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekInQuarter = Math.ceil(diff / oneWeek);
  
  return Math.min(Math.max(weekInQuarter, 1), 12);
};

export const getQuarterFromGoal = (goalQuarter: string | null): string => {
  if (!goalQuarter) return "Q1";
  return goalQuarter.split('-')[0];
};