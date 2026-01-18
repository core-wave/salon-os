import AppointmentRow from "@/components/appointment-row";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { salonCore } from "@/lib/core";
import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { notFound } from "next/navigation";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; locationSlug: string }>;
}) {
  const { organizationSlug, locationSlug } = await params;

  const organization = await salonCore.getOrganizationBySlug(organizationSlug);
  if (!organization) notFound();

  const location = await organization.getLocationBySlug(locationSlug);
  if (!location) notFound();

  const appointments = await location.listAppointments();

  const nextAppointment = appointments.find((apt) => apt.status === "Planned");

  return (
    <>
      <DashboardPageHeader
        title="Overview"
        description="Welcome back! Here's what's happening today"
      >
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="tertiary" fullWidth>
            <Icon icon={`tabler:plus`} />
            New Customer
          </Button>
          <Button fullWidth>
            <Icon icon={`tabler:plus`} />
            New Appointment
          </Button>
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Card.Title className="text-sm font-medium">
              Appointments Today
            </Card.Title>
            <Icon icon={`tabler:calendar-event`} className="text-muted" />
          </Card.Header>
          <Card.Content>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted">3 completed, 5 upcoming</p>
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
            <div className="text-2xl font-bold">$640</div>
            <p className="text-xs text-muted">From {"today's"} appointments</p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Card.Title className="text-sm font-medium">
              Free Slots Today
            </Card.Title>
            <Icon icon={`tabler:clock`} className="text-muted" />
          </Card.Header>
          <Card.Content>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted">Available time slots</p>
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
        <Card.Content className="grid grid-cols-[auto_auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
          {appointments.map((appointment, idx) => (
            <AppointmentRow key={idx} {...appointment} />
          ))}
        </Card.Content>
      </Card>
    </>
  );
}
