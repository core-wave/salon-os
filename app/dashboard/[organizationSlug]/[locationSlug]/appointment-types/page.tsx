import DeleteAppointmentType from "@/components/delete-appointment-type";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { salonCore } from "@/lib/core";
import {
  Button,
  Card,
  Chip,
  Description,
  Label,
  Modal,
  Separator,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { notFound } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import CreateAppointmentTypeForm from "./form";

export default async function AppointmentTypesPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; locationSlug: string }>;
}) {
  const { organizationSlug, locationSlug } = await params;

  const location = await salonCore.getLocationByFullSlug(
    organizationSlug,
    locationSlug
  );
  if (!location) notFound();

  const appointmentTypes = await location.listAppointmentTypes();

  return (
    <>
      <DashboardPageHeader
        title="Appointment Types"
        description="Manage your services and pricing"
      >
        <CreateAppointmentTypeForm />
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
                color={type.isActive ? "success" : "default"}
                variant={type.isActive ? "soft" : "soft"}
                className="justify-self-start"
              >
                {type.isActive ? "Active" : "Inactive"}
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
