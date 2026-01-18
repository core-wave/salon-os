import {
  Button,
  ButtonGroup,
  Card,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { salonCore } from "@/lib/core";
import AppointmentRow from "@/components/appointment-row";
import { notFound } from "next/navigation";
import CreateAppointmentForm from "@/components/forms/create-appointment";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; locationSlug: string }>;
}) {
  const { organizationSlug, locationSlug } = await params;

  const organization = await salonCore.getOrganizationBySlug(organizationSlug);
  if (!organization) notFound();

  const location = await organization.getLocationBySlug(locationSlug);
  if (!location) notFound();

  const [appointments, appointmentTypes, customers] = await Promise.all([
    location.listAppointments(),
    location.listAppointmentTypes(),
    organization.listCustomers(),
  ]);

  return (
    <>
      <DashboardPageHeader
        title="Appointments"
        description="Manage and schedule appointments"
      >
        <CreateAppointmentForm
          appointmentTypes={appointmentTypes}
          currency="EUR"
          locationId={location.data.id}
          customers={customers}
        />
      </DashboardPageHeader>

      <div className="flex gap-4 items-center">
        <ButtonGroup variant="tertiary">
          <Button isIconOnly>
            <Icon icon={`tabler:chevron-left`} />
          </Button>
          <Button>Today</Button>
          <Button isIconOnly>
            <Icon icon={`tabler:chevron-right`} />
          </Button>
        </ButtonGroup>

        <Label className="flex-1">
          {new Intl.DateTimeFormat("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </Label>

        <Select className="w-32" defaultValue={"day"}>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="day" textValue="day">
                Day View
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="week" textValue="week">
                Week View
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="list" textValue="list">
                List View
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <Card className="gap-6">
        <div className="grid grid-cols-[auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
          <Label className="font-semibold">Customer</Label>
          <Label className="font-semibold">Date</Label>
          <Label className="font-semibold">Appointment Type</Label>
          <Label className="font-semibold">Status</Label>
          {appointments.map((appt, idx) => (
            <AppointmentRow {...appt} key={idx} />
          ))}
        </div>
      </Card>
    </>
  );
}
