export type OpeningHours = {
  dayOfWeek:
    | 0 // sunday
    | 1 // monday
    | 2 // tuesday
    | 3 // wednesday
    | 4 // thursday
    | 5 // friday
    | 6; // saturday
  isOpen: boolean;
  hours: {
    start: string;
    end: string;
  }[];
};

export type OpeningHoursException = Omit<OpeningHours, "dayOfWeek"> & {
  date: string;
};

export const mockOpeningHours: OpeningHours[] = [
  {
    dayOfWeek: 0, // Sunday
    isOpen: false,
    hours: [],
  },
  {
    dayOfWeek: 1, // Monday
    isOpen: true,
    hours: [
      { start: "09:00", end: "12:30" },
      { start: "13:30", end: "18:00" },
    ],
  },
  {
    dayOfWeek: 2, // Tuesday
    isOpen: true,
    hours: [
      { start: "09:00", end: "12:30" },
      { start: "13:30", end: "18:00" },
    ],
  },
  {
    dayOfWeek: 3, // Wednesday
    isOpen: true,
    hours: [
      { start: "09:00", end: "12:30" },
      { start: "13:30", end: "18:00" },
    ],
  },
  {
    dayOfWeek: 4, // Thursday
    isOpen: true,
    hours: [
      { start: "10:00", end: "14:00" },
      { start: "15:00", end: "20:00" }, // late evening
    ],
  },
  {
    dayOfWeek: 5, // Friday
    isOpen: true,
    hours: [
      { start: "09:00", end: "12:30" },
      { start: "13:30", end: "17:00" },
    ],
  },
  {
    dayOfWeek: 6, // Saturday
    isOpen: true,
    hours: [{ start: "09:00", end: "14:00" }],
  },
];

export const mockOpeningHoursExceptions: OpeningHoursException[] = [
  {
    date: "2026-01-01", // New Year’s Day
    isOpen: false,
    hours: [],
  },
  {
    date: "2026-04-27", // King’s Day (NL)
    isOpen: true,
    hours: [{ start: "10:00", end: "14:00" }],
  },
  {
    date: "2026-05-04", // Remembrance Day (shorter hours)
    isOpen: true,
    hours: [{ start: "09:00", end: "12:00" }],
  },
  {
    date: "2026-05-05", // Liberation Day
    isOpen: false,
    hours: [],
  },
  {
    date: "2026-06-12", // Personal day off
    isOpen: false,
    hours: [],
  },
  {
    date: "2026-07-18", // Summer Saturday (shorter)
    isOpen: true,
    hours: [{ start: "09:00", end: "13:00" }],
  },
  {
    date: "2026-08-21", // Late opening
    isOpen: true,
    hours: [{ start: "12:00", end: "20:00" }],
  },
  {
    date: "2026-12-24", // Christmas Eve
    isOpen: true,
    hours: [{ start: "09:00", end: "14:00" }],
  },
  {
    date: "2026-12-25", // Christmas Day
    isOpen: false,
    hours: [],
  },
  {
    date: "2026-12-26", // Boxing Day
    isOpen: false,
    hours: [],
  },
];
