import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { Card, Chip, Label, Separator } from "@heroui/react";
import { mockOpeningHoursExceptions } from "@/lib/mockdata/opening-hours";
import { Fragment } from "react/jsx-runtime";
import { salonCore } from "@/lib/core";
import { notFound } from "next/navigation";

const DAY_LABELS = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
} as const;

export default async function OpeningHoursPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; locationSlug: string }>;
}) {
  const { organizationSlug, locationSlug } = await params;

  const organization = await salonCore.getOrganizationBySlug(organizationSlug);
  if (!organization) notFound();

  const location = await organization.getLocationBySlug(locationSlug);
  if (!location) notFound();

  const regularOpeningHours = await location.listRegularOpeningHours();

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
          {regularOpeningHours.map((day) => (
            <Fragment key={day.dayOfWeek}>
              <Separator className="col-span-3" />
              {/* Day */}
              {/* <Label className="font-normal">{DAY_LABELS[day.dayOfWeek]}</Label> */}

              {/* Status */}
              {day.isClosed ? (
                <Chip
                  className="justify-self-start w-fit"
                  color="default"
                  variant="soft"
                >
                  Closed
                </Chip>
              ) : (
                <Chip
                  className="justify-self-start w-fit"
                  color="success"
                  variant="soft"
                >
                  Open
                </Chip>
              )}

              {/* Hours */}
              <div className="flex gap-2 flex-wrap">
                {day.isClosed ? (
                  <Label className="text-muted">—</Label>
                ) : (
                  <Chip color="accent" variant="soft">
                    {day.opensAt}–{day.closesAt}
                  </Chip>
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
