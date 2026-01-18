"use client";

import { createAppointment } from "@/lib/appointments/functions";
import { SelectAppointmentType, SelectCustomer } from "@/lib/db/types";
import {
  dateToCalendarDate,
  dateToTimeValue,
  nextQuarterHour,
} from "@/lib/utils";
import {
  Button,
  DateField,
  DateInputGroup,
  Input,
  Key,
  Label,
  ListBox,
  Modal,
  Select,
  Spinner,
  TextArea,
  TextField,
  TimeField,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useEffect, useState } from "react";

export default function CreateAppointmentForm({
  locationId,
  currency,
  appointmentTypes,
  customers,
}: {
  locationId: string;
  currency: string;
  appointmentTypes: SelectAppointmentType[];
  customers: SelectCustomer[];
}) {
  const formAction = createAppointment.bind(null, locationId, currency);

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  useEffect(() => {
    if (state.status === "success") {
      close();
    }
  }, [state]);

  return (
    <>
      <Button onPress={open}>
        <Icon icon={`tabler:plus`} />
        New Appointment
      </Button>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>New Appointment</Modal.Heading>
              {/* <p className="text-sm leading-5 text-muted">
                Enter the details to update your appointment type
              </p> */}
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="mt-4 flex flex-col gap-4 overflow-visible">
                <Select
                  placeholder="Select one"
                  name="appointmentTypeId"
                  defaultValue={state.fieldValues?.appointmentTypeId}
                >
                  <Label>Appointment Type</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {appointmentTypes.map((t) => (
                        <ListBox.Item key={t.id} id={t.id} textValue={t.name}>
                          {t.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  placeholder="Select one"
                  name="customerId"
                  defaultValue={state.fieldValues?.customerId}
                >
                  <Label>Customer</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {customers.map((c) => (
                        <ListBox.Item key={c.id} id={c.id} textValue={c.name}>
                          {c.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <TextField name="notes" defaultValue={state.fieldValues?.notes}>
                  <Label>Notes</Label>
                  <TextArea placeholder="Optional" />
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={close} variant="ghost">
                  Cancel
                </Button>
                <Button type="submit">
                  {isLoading && <Spinner size="sm" color="current" />}
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
