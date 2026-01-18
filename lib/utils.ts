import { CalendarDate, Time } from "@internationalized/date";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function timeStringToTime(value: string): Time {
  const [h, m] = value.split(":").map(Number);
  return new Time(h ?? 0, m ?? 0);
}

export function getInitials(fullName: string): string {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function dateToCalendarDate(date?: Date) {
  if (!date) return undefined;

  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

export function dateToTimeValue(date?: Date): Time | undefined {
  if (!date) return undefined;

  return new Time(date.getHours(), date.getMinutes(), date.getSeconds());
}

export function nextQuarterHour(): Date {
  const now = new Date();

  const minutes = now.getMinutes();
  const nextMinutes = Math.floor(minutes / 15) * 15 + 15;

  const result = new Date(now);
  result.setMinutes(nextMinutes, 0, 0);

  return result;
}
