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

export function getInitials(fullName: string): string {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
