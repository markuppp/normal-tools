export type CalendarDifference = {
  years: number;
  months: number;
  days: number;
};

export function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) return null;
  return date;
}

export function localDateTimeInput(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function daysInUtcMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

export function addUtcMonthsClamped(date: Date, months: number) {
  const targetMonth = date.getUTCMonth() + months;
  const targetYear = date.getUTCFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const day = Math.min(date.getUTCDate(), daysInUtcMonth(targetYear, normalizedMonth));
  return new Date(Date.UTC(targetYear, normalizedMonth, day));
}

export function addUtcYearsClamped(date: Date, years: number) {
  const targetYear = date.getUTCFullYear() + years;
  const month = date.getUTCMonth();
  const day = Math.min(date.getUTCDate(), daysInUtcMonth(targetYear, month));
  return new Date(Date.UTC(targetYear, month, day));
}

export function calendarDifference(earlier: Date, later: Date): CalendarDifference {
  let years = later.getUTCFullYear() - earlier.getUTCFullYear();
  while (years > 0 && addUtcYearsClamped(earlier, years) > later) years--;
  const afterYears = addUtcYearsClamped(earlier, years);

  let months = (later.getUTCFullYear() - afterYears.getUTCFullYear()) * 12
    + later.getUTCMonth() - afterYears.getUTCMonth();
  while (months > 0 && addUtcMonthsClamped(afterYears, months) > later) months--;
  const afterMonths = addUtcMonthsClamped(afterYears, months);
  const days = Math.round((later.getTime() - afterMonths.getTime()) / 86_400_000);

  return { years, months, days };
}
