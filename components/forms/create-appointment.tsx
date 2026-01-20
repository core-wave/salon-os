"use client";

import CancelButton from "@/components/form-fields/cancel-button";
import SubmitButton from "@/components/form-fields/submit-button";
import { createAppointment } from "@/lib/appointments/functions";
import { SelectAppointmentType, SelectCustomer } from "@/lib/db/types";
import { clientEnv } from "@/lib/env/client";
import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function CreateAppointmentForm({
  locationSlug,
  currency,
  appointmentTypes,
  customers,
}: {
  locationSlug: string;
  currency: string;
  appointmentTypes: SelectAppointmentType[];
  customers: SelectCustomer[];
}) {
  const formAction = createAppointment.bind(null, locationSlug, currency);

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      toast("Appointment created", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
        indicator: <Icon icon="tabler:check" />,
      });

      close();
      router.refresh();
    }

    if (state.status === "error") {
      toast.danger("Error creating appointment", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
      });
    }
  }, [state, close, router]);

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
                  variant="secondary"
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
                  variant="secondary"
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

                <TextField
                  variant="secondary"
                  name="notes"
                  defaultValue={state.fieldValues?.notes}
                >
                  <Label>Notes</Label>
                  <TextArea placeholder="Optional" />
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <CancelButton onCancel={close} />
                <SubmitButton
                  isLoading={isLoading}
                  label="Save"
                  loadingLabel="Saving"
                />
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
