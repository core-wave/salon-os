"use client";

import {
  createAppointmentType,
  updateAppointmentType,
} from "@/lib/appointment-types/functions";
import { SelectAppointmentType } from "@/lib/db/types";
import {
  Button,
  ErrorMessage,
  Input,
  Label,
  Modal,
  Spinner,
  Switch,
  TextArea,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useEffect } from "react";

export default function UpdateAppointmentTypeForm({
  appointmentType,
}: {
  appointmentType: SelectAppointmentType;
}) {
  const formAction = updateAppointmentType.bind(null, appointmentType.id);

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
    fieldValues: {
      ...appointmentType,
      description: appointmentType.description || "",
    },
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  useEffect(() => {
    if (state.status === "success") {
      close();
    }
  }, [state]);

  return (
    <>
      <Button onPress={open} isIconOnly variant="ghost">
        <Icon icon={`tabler:pencil`} />
      </Button>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Update Appointment Type</Modal.Heading>
              <p className="text-sm leading-5 text-muted">
                Enter the details to update your appointment type
              </p>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="mt-4 flex flex-col gap-4 overflow-visible">
                <TextField name="name" defaultValue={state.fieldValues?.name}>
                  <Label>Name</Label>
                  <Input placeholder="Men's Haircut" />
                  {state.status === "error" && state.fieldErrors?.name && (
                    <ErrorMessage>
                      {state.fieldErrors.name.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField
                  name="description"
                  defaultValue={state.fieldValues?.description}
                >
                  <Label>Description</Label>
                  <TextArea placeholder="Men's Haircut" />
                  {state.status === "error" &&
                    state.fieldErrors?.description && (
                      <ErrorMessage>
                        {state.fieldErrors.description.errors[0]}
                      </ErrorMessage>
                    )}
                </TextField>

                <div className="flex gap-4">
                  <TextField
                    name="durationMinutes"
                    defaultValue={state.fieldValues?.durationMinutes?.toString()}
                    fullWidth
                  >
                    <Label>Duration</Label>
                    <Input placeholder="30" />
                    {state.status === "error" &&
                      state.fieldErrors?.durationMinutes && (
                        <ErrorMessage>
                          {state.fieldErrors.durationMinutes.errors[0]}
                        </ErrorMessage>
                      )}
                  </TextField>

                  <TextField
                    name="price"
                    defaultValue={state.fieldValues?.price?.toString()}
                    fullWidth
                  >
                    <Label>Price</Label>
                    <Input placeholder="30" />
                    {state.status === "error" && state.fieldErrors?.price && (
                      <ErrorMessage>
                        {state.fieldErrors.price.errors[0]}
                      </ErrorMessage>
                    )}
                  </TextField>
                </div>

                <Switch
                  name="isActive"
                  defaultSelected={state.fieldValues?.isActive}
                >
                  {({ isSelected }) => (
                    <>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Label className="text-sm">
                        {isSelected
                          ? "Available for bookings"
                          : "Not available for bookings"}
                      </Label>
                    </>
                  )}
                </Switch>

                <Input
                  hidden
                  name="currency"
                  defaultValue={state.fieldValues?.currency}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={close} variant="secondary">
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
