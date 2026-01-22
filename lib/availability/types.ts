export type TimeSlot = {
  startsAt: string; // ISO 8601 in location timezone
  endsAt: string; // ISO 8601 in location timezone
  display: {
    startTime: string; // e.g., "09:00"
    endTime: string; // e.g., "09:30"
  };
};
