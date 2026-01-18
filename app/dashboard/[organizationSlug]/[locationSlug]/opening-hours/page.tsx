import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { Card, Chip, Label, Separator } from "@heroui/react";
import { Fragment } from "react";
import { salonCore } from "@/lib/core";
import { notFound } from "next/navigation";
import UpdateOpeningHoursForm from "@/components/forms/update-opening-hours";
import UpsertOpeningHourExceptionForm from "@/components/forms/upsert-opening-hour-exception";

const DAYS = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
} as const;

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
  const openingHourExceptions = await location.listOpeningHourExceptions();

  const openingHoursByDay = Object.keys(DAYS).map((key) => {
    const dayOfWeek = Number(key) as DayOfWeek;

    const slots = regularOpeningHours.filter(
      (slot) => slot.dayOfWeek === dayOfWeek
    );

    return {
      dayOfWeek,
      label: DAYS[dayOfWeek],
      slots,
      isClosed: slots.length === 0,
    };
  });

  return (
    <>
      <DashboardPageHeader
        title="Opening Hours"
        description="Manage your availability"
      />

      <Card className="gap-6">
        <h2 className="font-semibold text-lg">Regular Opening Hours</h2>

        <div className="grid grid-cols-[auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
          <Label className="font-semibold">Day</Label>
          <Label className="font-semibold">Status</Label>
          <Label className="font-semibold">Opening Hours</Label>
          <Label className="font-semibold">Actions</Label>

          {openingHoursByDay.map((day) => (
            <Fragment key={day.dayOfWeek}>
              <Separator className="col-span-4" />

              <Label>{day.label}</Label>

              {day.isClosed ? (
                <Chip variant="soft" className="justify-self-start">
                  Closed
                </Chip>
              ) : (
                <Chip
                  color="success"
                  variant="soft"
                  className="justify-self-start"
                >
                  Open
                </Chip>
              )}

              <div className="flex gap-2 flex-wrap">
                {day.isClosed ? (
                  <Label className="text-muted">—</Label>
                ) : (
                  day.slots.map((slot, idx) => (
                    <Chip key={idx} variant="soft">
                      {slot.opensAt.slice(0, 5)}–{slot.closesAt.slice(0, 5)}
                    </Chip>
                  ))
                )}
              </div>

              <div className="flex">
                <UpdateOpeningHoursForm
                  dayOfWeek={day.dayOfWeek}
                  locationId={location.data.id}
                  slots={day.slots}
                />
              </div>
            </Fragment>
          ))}
        </div>
      </Card>

      <Card className="gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-lg">Exceptions</h2>
            <p className="text-sm text-muted">
              Override your regular hours for specific dates.
            </p>
          </div>
          <UpsertOpeningHourExceptionForm locationId={location.data.id} />
        </div>

        {openingHourExceptions.length === 0 ? (
          <p className="text-sm text-muted">
            No exceptions yet. Add one to override a specific date.
          </p>
        ) : (
          <div className="grid grid-cols-[auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
            <Label className="font-semibold">Date</Label>
            <Label className="font-semibold">Status</Label>
            <Label className="font-semibold">Opening Hours</Label>
            <Label className="font-semibold">Actions</Label>

            {openingHourExceptions.map((exception) => (
              <Fragment key={exception.id}>
                <Separator className="col-span-4" />
                <Label>{exception.date}</Label>

                {exception.isClosed ? (
                  <Chip variant="soft" className="justify-self-start">
                    Closed
                  </Chip>
                ) : (
                  <Chip
                    color="success"
                    variant="soft"
                    className="justify-self-start"
                  >
                    Open
                  </Chip>
                )}

                <div className="flex gap-2 flex-wrap">
                  {exception.isClosed || exception.slots.length === 0 ? (
                    <Label className="text-muted">Closed all day</Label>
                  ) : (
                    exception.slots.map((slot, idx) => (
                      <Chip key={idx} variant="soft">
                        {slot.opensAt.slice(0, 5)}–{slot.closesAt.slice(0, 5)}
                      </Chip>
                    ))
                  )}
                  {exception.remark && (
                    <Chip variant="soft" className="text-muted">
                      {exception.remark}
                    </Chip>
                  )}
                </div>

                <div className="flex">
                  <UpsertOpeningHourExceptionForm
                    locationId={location.data.id}
                    exception={{
                      date: exception.date,
                      remark: exception.remark ?? null,
                      slots: exception.slots,
                    }}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
