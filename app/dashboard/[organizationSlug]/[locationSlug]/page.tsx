import AppointmentRow from "@/components/appointment-row";
import CreateAppointmentForm from "@/components/forms/create-appointment";
import CreateCustomerForm from "@/components/forms/create-customer";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { salonCore } from "@/lib/core";
import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { notFound } from "next/navigation";
import { utcToZonedTime } from "date-fns-tz";
import { isSameDay } from "date-fns";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; locationSlug: string }>;
}) {
  const { organizationSlug, locationSlug } = await params;

  const [org, loc] = await Promise.all([
    salonCore.getOrganizationBySlug(organizationSlug),
    salonCore.getLocationBySlug(locationSlug),
  ]);

  if (!org || !loc) notFound();

  const [allAppointments, appointmentTypes, customers] = await Promise.all([
    loc.listAppointments(),
    loc.listAppointmentTypes(),
    org.listCustomers(),
  ]);

  // Filter for today's appointments in the location's timezone
  const timeZone = loc.data.timeZone;
  const nowInTz = utcToZonedTime(new Date(), timeZone);

  const todaysAppointments = allAppointments.filter((apt) => {
    const aptDateInTz = utcToZonedTime(apt.startsAt, timeZone);
    return isSameDay(aptDateInTz, nowInTz);
  });

  // Sort by start time
  todaysAppointments.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  // Find next upcoming appointment (Planned and starts after now)
  const now = new Date();
  const nextAppointment = todaysAppointments.find(
    (apt) => apt.status === "Planned" && apt.startsAt > now
  );

  // Calculate stats for summary cards
  const completedToday = todaysAppointments.filter((apt) => apt.status === "Completed").length;
  const upcomingToday = todaysAppointments.filter(
    (apt) => apt.status === "Planned" && apt.startsAt > now
  ).length;

  // Calculate expected revenue from today's planned appointments
  const expectedRevenue = todaysAppointments
    .filter((apt) => apt.status === "Planned")
    .reduce((sum, apt) => sum + (apt.appointmentType.price || 0), 0);

  const currency = todaysAppointments[0]?.appointmentType.currency || "EUR";

  return (
    <>
      <DashboardPageHeader
        title="Overview"
        description="Welcome back! Here's what's happening today"
      >
        <div className="flex gap-2 w-full sm:w-auto">
          <CreateCustomerForm
            organizationSlug={org.data.slug}
            variant="tertiary"
          />
          <CreateAppointmentForm
            appointmentTypes={appointmentTypes}
            currency="EUR"
            locationSlug={loc.data.slug}
            customers={customers}
          />
        </div>
      </DashboardPageHeader>

      {/* Next Appointment - Prominent Card */}
      {nextAppointment && (
        <Card className="border border-accent bg-card">
          <Card.Header>
            <Card.Title>Next Appointment</Card.Title>
            <Card.Description>Coming up soon</Card.Description>
          </Card.Header>
          <Card.Content className="grid grid-cols-[auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
            <AppointmentRow {...nextAppointment} />
          </Card.Content>
        </Card>
      )}

      {/* Daily Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Card.Title className="text-sm font-medium">
              Appointments Today
            </Card.Title>
            <Icon icon={`tabler:calendar-event`} className="text-muted" />
          </Card.Header>
          <Card.Content>
            <div className="text-2xl font-bold">{todaysAppointments.length}</div>
            <p className="text-xs text-muted">
              {completedToday} completed, {upcomingToday} upcoming
            </p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Card.Title className="text-sm font-medium">
              Expected Revenue
            </Card.Title>
            <Icon icon={`tabler:cash-plus`} className="text-muted" />
          </Card.Header>
          <Card.Content>
            <div className="text-2xl font-bold">
              {expectedRevenue > 0 ? `${expectedRevenue} ${currency}` : "-"}
            </div>
            <p className="text-xs text-muted">From {"today's"} appointments</p>
          </Card.Content>
        </Card>
      </div>

      {/* Today's Appointments List */}
      <Card>
        <Card.Header>
          <Card.Title>{"Today's"} Appointments</Card.Title>
          <Card.Description>
            All scheduled appointments for today
          </Card.Description>
        </Card.Header>
        {todaysAppointments.length > 0 ? (
          <Card.Content className="grid grid-cols-[auto_auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
            {todaysAppointments.map((appointment, idx) => (
              <AppointmentRow key={idx} {...appointment} />
            ))}
          </Card.Content>
        ) : (
          <Card.Content className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted/10 p-4 mb-4">
              <Icon icon="tabler:calendar-off" className="w-8 h-8 text-muted" />
            </div>
            <p className="text-muted font-medium mb-1">No appointments today</p>
            <p className="text-sm text-muted/70">
              Your schedule is clear. Time for a coffee break!
            </p>
          </Card.Content>
        )}
      </Card>
    </>
  );
}
