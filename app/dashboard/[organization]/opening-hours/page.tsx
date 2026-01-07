import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { Button, Card, Chip, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  mockOpeningHours,
  mockOpeningHoursExceptions,
} from "@/lib/mockdata/opening-hours";
import { Fragment } from "react/jsx-runtime";

const DAY_LABELS = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
} as const;

export default function OpeningHoursPage() {
  return (
    <>
      <DashboardPageHeader
        title="Opening Hours"
        description="Manage your availability"
      />

      <Card className="gap-6">
        <h2 className="font-semibold text-lg">Regular Opening Hours</h2>

        <div className="grid grid-cols-[auto_auto_auto] gap-y-3 gap-x-4 items-center">
          {/* Header */}
          <Label className="font-semibold">Day of Week</Label>
          <Label className="font-semibold">Status</Label>
          <Label className="font-semibold">Opening Hours</Label>

          {/* Rows */}
          {mockOpeningHours.map((day) => (
            <Fragment key={day.dayOfWeek}>
              <Separator className="col-span-3" />
              {/* Day */}
              <Label className="font-normal">{DAY_LABELS[day.dayOfWeek]}</Label>

              {/* Status */}
              {day.isOpen ? (
                <Chip
                  className="justify-self-start w-fit"
                  color="success"
                  variant="soft"
                >
                  Open
                </Chip>
              ) : (
                <Chip
                  className="justify-self-start w-fit"
                  color="default"
                  variant="soft"
                >
                  Closed
                </Chip>
              )}

              {/* Hours */}
              <div className="flex gap-2 flex-wrap">
                {day.isOpen && day.hours.length > 0 ? (
                  day.hours.map((slot, idx) => (
                    <Chip key={idx} color="accent" variant="soft">
                      {slot.start}–{slot.end}
                    </Chip>
                  ))
                ) : (
                  <Label className="text-muted">—</Label>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </Card>

      <Card className="gap-6">
        <h2 className="font-semibold text-lg">Exceptions</h2>

        <div className="grid grid-cols-[auto_auto_auto] gap-y-3 gap-x-4 items-center">
          {/* Header */}
          <Label className="font-semibold">Date</Label>
          <Label className="font-semibold">Status</Label>
          <Label className="font-semibold">Opening Hours</Label>

          {/* Rows */}
          {mockOpeningHoursExceptions.map((exc) => (
            <Fragment key={exc.date}>
              <Separator className="col-span-3" />
              {/* Day */}
              <Label className="font-normal">{exc.date}</Label>

              {/* Status */}
              {exc.isOpen ? (
                <Chip
                  className="justify-self-start w-fit"
                  color="success"
                  variant="soft"
                >
                  Open
                </Chip>
              ) : (
                <Chip
                  className="justify-self-start w-fit"
                  color="default"
                  variant="soft"
                >
                  Closed
                </Chip>
              )}

              {/* Hours */}
              <div className="flex gap-2 flex-wrap">
                {exc.isOpen && exc.hours.length > 0 ? (
                  exc.hours.map((slot, idx) => (
                    <Chip key={idx} color="accent" variant="soft">
                      {slot.start}–{slot.end}
                    </Chip>
                  ))
                ) : (
                  <Label className="text-muted">—</Label>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </Card>
    </>
  );
}
