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

/**
 * Convert time string (HH:MM:SS or HH:MM) to total minutes since midnight
 * @example timeToMinutes("09:30:00") => 570
 */
export function timeToMinutes(time: string): number {
  const parts = time.split(":");
  const hours = parseInt(parts[0] ?? "0", 10);
  const minutes = parseInt(parts[1] ?? "0", 10);
  return hours * 60 + minutes;
}

/**
 * Convert total minutes since midnight to time string (HH:MM:SS)
 * @example minutesToTime(570) => "09:30:00"
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
}

/**
 * Add minutes to a time string and return new time string
 * @example addMinutesToTime("09:30:00", 45) => "10:15:00"
 */
export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const currentMinutes = timeToMinutes(time);
  const newMinutes = currentMinutes + minutesToAdd;
  return minutesToTime(newMinutes);
}

/**
 * Check if two time ranges overlap
 * @param start1 Start time of first range
 * @param end1 End time of first range
 * @param start2 Start time of second range
 * @param end2 End time of second range
 * @returns true if ranges overlap, false otherwise
 */
export function doTimesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = timeToMinutes(end1);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = timeToMinutes(end2);

  // Overlap occurs when: start1 < end2 AND end1 > start2
  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
}
