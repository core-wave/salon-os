import DeleteAppointmentType from "@/components/delete-appointment-type";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { salonCore } from "@/lib/core";
import { Button, Card, Chip, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { notFound } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default async function AppointmentTypesPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  const org = await salonCore.getOrganizationBySlug(organizationSlug);
  if (!org) notFound();

  const availableLocations = await org.listLocations();
  if (!availableLocations) notFound();

  const location = await org.getLocation(availableLocations[0].id);
  if (!location) notFound();

  const appointmentTypes = await location.listAppointmentTypes();

  return (
    <>
      <DashboardPageHeader
        title="Appointment Types"
        description="Manage your services and pricing"
      >
        <Button>
          <Icon icon={`tabler:plus`} />
          New Appointment Type
        </Button>
      </DashboardPageHeader>

      <Card className="gap-6">
        <div className="grid grid-cols-[auto_auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
          <Label className="font-semibold">Name</Label>
          <Label className="font-semibold">Duration</Label>
          <Label className="font-semibold">Price</Label>
          <Label className="font-semibold">Status</Label>
          <Label className="font-semibold">Actions</Label>
          {appointmentTypes.map((type, idx) => (
            <Fragment key={idx}>
              <Separator className="col-span-5" />
              <Label className="font-medium">{type.name}</Label>
              <Label className="font-normal">{type.durationMinutes} min</Label>
              <Label className="font-normal">
                {type.price} {type.currency}
              </Label>
              <Chip
                color="success"
                variant="soft"
                className="justify-self-start"
              >
                Active
              </Chip>
              <div className="flex">
                <Button isIconOnly variant="ghost">
                  <Icon icon={`tabler:pencil`} />
                </Button>
                <DeleteAppointmentType
                  type="Appointment Type"
                  description={`Are you sure you want to delete ${type.name}?`}
                />
              </div>
            </Fragment>
          ))}
        </div>
      </Card>
    </>
  );
}
