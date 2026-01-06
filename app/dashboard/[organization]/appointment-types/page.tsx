import { Card, Chip, Label, Separator } from "@heroui/react";
import { appointmentTypes } from "@/app/booking/page";
import { Fragment } from "react/jsx-runtime";

export default function AppointmentTypesPage() {
  return (
    <>
      <h1>Appointment Types</h1>
      <Card className="gap-6">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-y-3 gap-x-4 items-center">
          <Label className="font-semibold">Status</Label>
          <Label className="font-semibold">Name</Label>
          <Label className="font-semibold">Duration</Label>
          <Label className="font-semibold">Price</Label>
          {appointmentTypes.map((type, idx) => (
            <Fragment key={idx}>
              <Separator className="col-span-4" />
              <Chip color="success" variant="soft">
                Active
              </Chip>
              <Label className="font-normal">{type.title}</Label>
              <Label className="font-normal">{type.duration}</Label>
              <Label className="font-normal">{type.price}</Label>
            </Fragment>
          ))}
        </div>
      </Card>
    </>
  );
}
