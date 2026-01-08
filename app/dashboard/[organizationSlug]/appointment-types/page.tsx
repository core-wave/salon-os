import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { salonCore } from "@/lib/core";
import { Button, Card, Chip, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Fragment } from "react/jsx-runtime";

export default async function AppointmentTypesPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  const org = await salonCore.getOrganizationBySlug(organizationSlug);
  const appointmentTypes = await org.listAppointmentTypes();

  console.log(appointmentTypes);

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
        <div className="grid grid-cols-[auto_auto_auto_auto] gap-y-3 gap-x-4 items-center">
          <Label className="font-semibold">Status</Label>
          <Label className="font-semibold">Name</Label>
          <Label className="font-semibold">Duration</Label>
          <Label className="font-semibold">Price</Label>
          {appointmentTypes.map((type, idx) => (
            <Fragment key={idx}>
              <Separator className="col-span-4" />
              <Chip
                color="success"
                variant="soft"
                className="justify-self-start"
              >
                Active
              </Chip>
              <Label className="font-normal">{type.title}</Label>
              <Label className="font-normal">{type.duration} min</Label>
              <Label className="font-normal">{type.price} eur</Label>
            </Fragment>
          ))}
        </div>
      </Card>
    </>
  );
}
