"use client";

import CancelButton from "@/components/form-fields/cancel-button";
import SubmitButton from "@/components/form-fields/submit-button";
import { createAppointment } from "@/lib/appointments/functions";
import { getAvailableSlots } from "@/lib/availability/functions";
import { TimeSlot } from "@/lib/availability/types";
import { SelectAppointmentType, SelectCustomer } from "@/lib/db/types";
import { clientEnv } from "@/lib/env/client";
import {
  Button,
  ErrorMessage,
  Input,
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
import { useActionState, useEffect, useState } from "react";

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

  // State for date and time slot selection
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] =
    useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Reset form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate("");
      setSelectedAppointmentTypeId("");
      setAvailableSlots([]);
    }
  }, [isOpen]);

  // Fetch available slots when date and appointment type change
  useEffect(() => {
    if (selectedDate && selectedAppointmentTypeId) {
      setLoadingSlots(true);
      getAvailableSlots(locationSlug, selectedDate, selectedAppointmentTypeId)
        .then((slots) => {
          setAvailableSlots(slots);
        })
        .catch((error) => {
          console.error("Error fetching slots:", error);
          setAvailableSlots([]);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, selectedAppointmentTypeId, locationSlug]);

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
                  onSelectionChange={(keys) => {
                    if (keys && keys !== "all") {
                      const keysArray = [...(keys as unknown as Set<string>)];
                      setSelectedAppointmentTypeId(keysArray[0] || "");
                    }
                  }}
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
                  name="date"
                  value={selectedDate}
                  onChange={(value) => setSelectedDate(value)}
                >
                  <Label>Date</Label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </TextField>

                <Select
                  variant="secondary"
                  placeholder={
                    !selectedDate || !selectedAppointmentTypeId
                      ? "Select appointment type and date first"
                      : loadingSlots
                        ? "Loading available times..."
                        : availableSlots.length === 0
                          ? "No available times"
                          : "Select a time"
                  }
                  name="startsAt"
                  isDisabled={
                    !selectedDate ||
                    !selectedAppointmentTypeId ||
                    loadingSlots ||
                    availableSlots.length === 0
                  }
                >
                  <Label>Time</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {availableSlots.map((slot) => (
                        <ListBox.Item
                          key={slot.startsAt}
                          id={slot.startsAt}
                          textValue={slot.display.startTime}
                        >
                          {slot.display.startTime} - {slot.display.endTime}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  {state.status === "error" && state.fieldErrors?.startsAt && (
                    <ErrorMessage>
                      {state.fieldErrors.startsAt.errors[0]}
                    </ErrorMessage>
                  )}
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
