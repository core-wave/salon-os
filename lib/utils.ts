import { Time } from "@internationalized/date";

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
