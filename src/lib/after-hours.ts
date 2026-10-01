/** Mountain local time, including automatic daylight-saving adjustments. */
const mountainTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Denver", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", hourCycle: "h23",
});
export const AFTER_HOURS_RECIPIENT = "1210009225@armailstnr.appspotmail.com";

function nthWeekday(year: number, month: number, weekday: number, occurrence: number) {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return new Date(Date.UTC(year, month, 1 + (weekday - first + 7) % 7 + (occurrence - 1) * 7));
}
function observed(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month, day));
  const weekday = date.getUTCDay();
  if (weekday === 6) date.setUTCDate(date.getUTCDate() - 1);
  if (weekday === 0) date.setUTCDate(date.getUTCDate() + 1);
  return date;
}
function dateKey(date: Date) { return date.toISOString().slice(0, 10); }

/** The 11 nationwide federal holidays, with Friday/Monday weekend observance. */
export function isObservedFederalHoliday(localDate: Date) {
  const year = localDate.getUTCFullYear();
  const holidays: Date[] = [];
  // Next year's New Year's Day can be observed on December 31 this year.
  for (const holidayYear of [year - 1, year, year + 1]) {
    const memorialDay = new Date(Date.UTC(holidayYear, 5, 0));
    memorialDay.setUTCDate(memorialDay.getUTCDate() - (memorialDay.getUTCDay() + 6) % 7);
    holidays.push(
      observed(holidayYear, 0, 1), nthWeekday(holidayYear, 0, 1, 3),
      nthWeekday(holidayYear, 1, 1, 3), memorialDay,
      observed(holidayYear, 5, 19), observed(holidayYear, 6, 4),
      nthWeekday(holidayYear, 8, 1, 1), nthWeekday(holidayYear, 9, 1, 2),
      observed(holidayYear, 10, 11), nthWeekday(holidayYear, 10, 4, 4),
      observed(holidayYear, 11, 25),
    );
  }
  return holidays.some(holiday => dateKey(holiday) === dateKey(localDate));
}

export function isAfterHours(now: Date = new Date()) {
  const parts = mountainTime.formatToParts(now);
  const part = (name: string) => Number(parts.find(value => value.type === name)!.value);
  const localDate = new Date(Date.UTC(part("year"), part("month") - 1, part("day")));
  const weekday = localDate.getUTCDay();
  return weekday === 0 || weekday === 6 || part("hour") < 8 || part("hour") >= 17 || isObservedFederalHoliday(localDate);
}

/** Preserve normal CCs; add the answering service only outside business hours. */
export function withAfterHoursRecipient(cc: readonly string[], now: Date = new Date()) {
  return isAfterHours(now) ? [...cc, AFTER_HOURS_RECIPIENT] : [...cc];
}
